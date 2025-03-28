import numpy as np
import pandas as pd
from patsy import dmatrix
import argparse
import os

def is_full_rank(design_df, formula):
    """
    Checks if the model matrix from the design dataframe is full rank.
    
    Parameters:
    - design_df (pd.DataFrame): Experimental design table with categorical variables.
    - formula (str): Model formula using R-style syntax (e.g., "~condition + batch").
    
    Returns:
    - bool: True if full rank, False if rank-deficient.
    """
    try:
        # Generate the design matrix using Patsy
        model_matrix = np.asarray(dmatrix(formula, design_df, return_type="dataframe"))

        # Compute rank
        rank = np.linalg.matrix_rank(model_matrix)
        
        # Check if full rank
        return rank == model_matrix.shape[1]
    except Exception as e:
        print(f"Error in model matrix computation: {e}")
        return False
    
def export_result(content, output_dir, filename="continueOrNot.txt"):
    """ Export QC metrics to a CSV file """
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, filename)
    with open(output_path, "w") as f:
        f.write(content)

def main():
    parser = argparse.ArgumentParser(description='Previous data checks before starting differential analysis.')
    parser.add_argument('--metadata', type=str, required=True, help='Path to metadata CSV file')
    parser.add_argument('--output', type=str, required=True, help='Output directory')

    args = parser.parse_args()

    # Load metadata
    metadata = pd.read_csv(args.metadata)
    # Set sample as index
    metadata.set_index(keys="Sample", inplace=True)
    # Get formula
    formula = "~" + " + ".join(metadata.columns)
    # Check if the design matrix is full rank
    rankResult = is_full_rank(metadata, formula)

    # Write result to file
    if rankResult:
        export_result("continue", args.output)
    else:
        export_result("stop", args.output)

if __name__ == "__main__":
    main()
