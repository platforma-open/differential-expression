# @platforma-open/milaboratories.run-deseq2-r.software

## 2.3.3

### Patch Changes

- bbd976e: Fix runtime `Permission denied` when the container runs as a non-root UID (MILAB-6263). The entrypoint re-invoked `renv::restore()` on every start, which tries to reconcile the system R library at `/usr/local/lib/R/site-library/` with the project lockfile. When the `r-base:4.4.2` base image preinstalled a version of a locked package (e.g. `rlang`) that differs from `renv.lock`, renv attempted to back up the system-library copy before replacing it — failing on hosts that run the container unprivileged. renv now installs into a project-local library at `/app/renv/library` and `R_LIBS_USER` points R at the same path, so the obsolete `/app/run.sh` wrapper and runtime restore are removed.

## 2.3.2

### Patch Changes

- de37c41: Support parquet format (update SDK)

## 2.3.1

### Patch Changes

- ffa440c: technical release
- 3b8e11b: technical release
- 6b91a76: technical release
- adf096d: technical release

## 2.3.0

### Minor Changes

- 4985d5e: deal with numeric numerator and denominators
- 67e6b27: Fix issues with numerical conditions and correct wrong block argument path

## 2.2.0

### Minor Changes

- e89d43a: Refactor error logs usage

## 2.1.0

### Minor Changes

- 757e7e2: Fixed bug in full rank matrix check

## 2.0.1

### Patch Changes

- f1ded2a: Full SDK update

## 2.0.0

### Major Changes

- 2975a01: Change Pcolumns organization and exports structure

## 1.8.0

### Minor Changes

- c6ad8a1: allow prepare venv on Windows

## 1.7.0

### Minor Changes

- db81af6: Added conditional execution step if model matrix not full rank

## 1.6.0

### Minor Changes

- 4dc33f9: New analysis options and Renv
