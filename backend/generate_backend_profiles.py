import os
import csv
import json
import sys


def main():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(backend_dir)

    # Paths
    github_root = os.path.dirname(project_root)
    raw_csv_path = os.path.join(github_root, "notebooks", "qfintrust_sme_dataset.csv")
    master_csv_path = os.path.join(
        github_root,
        "notebooks",
        "qfintrust_artifacts",
        "synthetic_data",
        "sme_master_dataset.csv",
    )
    original_json_path = os.path.join(
        project_root, "src", "data", "backendProfiles.json"
    )
    output_json_path = os.path.join(project_root, "src", "data", "backendProfiles.json")

    # 1. Read original verification status to preserve it
    original_verification = {}
    if os.path.exists(original_json_path):
        try:
            with open(original_json_path, "r", encoding="utf-8") as f:
                original_data = json.load(f)
                for profile in original_data:
                    original_verification[profile["smeId"]] = profile.get(
                        "blockchainVerified", "Pending"
                    )
        except Exception as e:
            print(f"Warning: Could not read original verification status: {e}")

    # Add current directory to path so scoring can be imported
    sys.path.append(backend_dir)
    from scoring import score_sme

    # 2. Load raw dataset to get document_completeness_score and bank_statement_consistency_score
    raw_data = {}
    if not os.path.exists(raw_csv_path):
        print(f"Error: Raw CSV not found at {raw_csv_path}")
        return

    with open(raw_csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_data[row["business_id"]] = row

    # 3. Load master dataset and generate correctly scored profiles
    if not os.path.exists(master_csv_path):
        print(f"Error: Master CSV not found at {master_csv_path}")
        return

    profiles = []
    with open(master_csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)[:100]  # First 100 profiles as in original

        for row_master in rows:
            sme_id = row_master["businessID"]
            row_raw = raw_data.get(sme_id)
            if not row_raw:
                print(f"Warning: SME {sme_id} not found in raw dataset. Skipping.")
                continue

            # Document completeness score (float 0.0 to 1.0) scaled to 0-100
            doc_score = float(row_raw["document_completeness_score"]) * 100

            # Bank statement consistency score (float 0.0 to 1.0)
            # We map 1.0 - consistency to credit utilization as a reasonable proxy
            credit_util = 1.0 - float(row_raw["bank_statement_consistency_score"])

            raw_input = {
                "smeId": sme_id,
                "businessName": row_master["businessName"],
                "sector": row_master["sector"],
                "annualRevenue": float(row_master["annualRevenue"]),
                "annualIncome": float(row_master["annualIncome"]),
                "monthlyRevenue": float(row_master["annualRevenue"]) / 12,
                "revenueGrowthRate": 0.08,  # Reasonable default growth rate
                "loanAmount": float(row_master["loanAmount"]),
                "debtToIncomeRatio": float(row_master["debtToIncomeRatio"]),
                "businessAgeMonths": int(row_master["yearsInBusiness"]) * 12,
                "employees": int(row_master["employees"]),
                "latePayments12m": int(row_master["latePayments"]),
                "esgScore": float(row_master["esgComposite"]),
                "financialDocsScore": doc_score,
                "cashFlowStability": float(row_master["cashFlowStability"]),
                "revenueVolatility": float(row_master["revenueVolatility"]),
                "creditUtilization": credit_util,
            }

            # Score SME using the authoritative backend function
            profile = score_sme(raw_input)

            # Restore the original blockchain verification status
            profile["blockchainVerified"] = original_verification.get(sme_id, "Pending")

            profiles.append(profile)

    # 4. Write back corrected profiles
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(profiles, f, indent=2, ensure_ascii=False)

    print(
        f"Success: Corrected and fully-scored {len(profiles)} backend profiles written to {output_json_path}"
    )


if __name__ == "__main__":
    main()
