# Overview

This block calculates differentially expressed genes (DEG) between conditions using [DESeq2](https://bioconductor.org/packages/release/bioc/html/DESeq2.html) v1.46.0. The block takes the output of any RNA-seq preprocessing block (e.g., STAR read mapping) as input. It then generates DEG lists as outputs that can be used by other downstream blocks. 

Please cite:
- *doi: [10.1186/s13059-014-0550-8](https://doi.org/10.1186/s13059-014-0550-8)*
