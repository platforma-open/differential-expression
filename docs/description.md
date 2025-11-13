# Overview

Identifies differentially expressed genes between experimental conditions in bulk RNA sequencing data using DESeq2, a statistical method based on negative binomial generalized linear models. The block takes count matrices from RNA-seq preprocessing blocks (e.g., STAR read mapping) as input and performs statistical testing to compare gene expression levels across conditions, accounting for biological variability and library size differences.

The block supports multiple comparisons by testing each numerator group against a common denominator baseline. Genes are filtered based on configurable thresholds: minimum log2 fold change and maximum adjusted p-value. Results include comprehensive differential expression tables with log2 fold changes, p-values, and adjusted p-values, as well as filtered tables containing only statistically significant genes suitable for downstream functional enrichment analysis and visualization.

The block uses DESeq2 v1.46.0 for differential expression analysis. When using this block in your research, cite the DESeq2 publication (Love et al. 2014) listed below.

The following publication describes the methodology used:

> Love, M. I., Huber, W., & Anders, S. (2014). Moderated estimation of fold change and dispersion for RNA-seq data with DESeq2. _Genome Biology_ **15**, 550 (2014). [https://doi.org/10.1186/s13059-014-0550-8](https://doi.org/10.1186/s13059-014-0550-8)
