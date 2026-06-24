#!/usr/bin/env bash
# download-ceda-data.sh
#
# Downloads CEDA AR6 WGI CSV files listed in tools/rag/data_sources/datasets/index.json.
# Uses direct file URLs (no directory scraping) — filenames are already known from index.json.
# Tries without credentials first; falls back to basic auth if a 401/403 is received.
#
# Usage:
#   bash scripts/download-ceda-data.sh
#   bash scripts/download-ceda-data.sh --user my@email.com
#   bash scripts/download-ceda-data.sh --no-auth   # skip credentials entirely (public data)
#
# CEDA account: https://services.ceda.ac.uk
# Note: CEDA uses a separate FTP/HTTP password from the web login password.
#       Check yours at: https://services.ceda.ac.uk/cedasite/myceda/user/accountdetails/

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DATASETS_DIR="$PROJECT_ROOT/tools/rag/data_sources/datasets"

# --- Parse args ---
CEDA_USER=""
CEDA_PASS=""
CEDA_TOKEN=""
NO_AUTH=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --user|-u)   CEDA_USER="$2"; shift 2 ;;
    --token|-t)  CEDA_TOKEN="$2"; shift 2 ;;
    --no-auth)   NO_AUTH=true; shift ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

# --- Check curl ---
if ! command -v curl &>/dev/null; then
  echo "ERROR: curl not found."
  exit 1
fi

# --- Credentials ---
if [[ "$NO_AUTH" == "false" && -z "$CEDA_TOKEN" ]]; then
  if [[ -z "$CEDA_USER" ]]; then
    read -rp "CEDA username (email) [press Enter to skip auth]: " CEDA_USER
  fi
  if [[ -n "$CEDA_USER" ]]; then
    read -rsp "CEDA password: " CEDA_PASS
    echo ""
  fi
fi

# --- Build auth flag for curl ---
# Supports: Bearer token (--token), basic auth (--user/--pass), or no auth
AUTH_FLAG=()
if [[ -n "$CEDA_TOKEN" ]]; then
  AUTH_FLAG=(-H "Authorization: Bearer $CEDA_TOKEN")
elif [[ -n "$CEDA_USER" && -n "$CEDA_PASS" ]]; then
  AUTH_FLAG=(--user "$CEDA_USER:$CEDA_PASS")
fi

# --- Download a single file ---
download_file() {
  local url="$1"
  local outfile="$2"

  # Skip if already present and non-empty
  if [[ -s "$outfile" ]]; then
    echo "    [skip] $(basename "$outfile")"
    return 0
  fi

  mkdir -p "$(dirname "$outfile")"

  local http_code
  http_code=$(curl -sL -w "%{http_code}" "${AUTH_FLAG[@]}" -o "$outfile" "$url")

  if [[ "$http_code" == "200" ]]; then
    # Sanity check: make sure we got CSV, not an HTML error page
    local first_line
    first_line=$(head -1 "$outfile" 2>/dev/null || echo "")
    if echo "$first_line" | grep -qi "<!doctype\|<html"; then
      rm -f "$outfile"
      echo "    [AUTH FAIL] $(basename "$url") — server returned HTML (login page?)"
      echo "                Check your CEDA FTP password at:"
      echo "                https://services.ceda.ac.uk/cedasite/myceda/user/accountdetails/"
      return 1
    fi
    echo "    [OK] $(basename "$url")"
    return 0
  else
    rm -f "$outfile"
    echo "    [HTTP $http_code] $(basename "$url")"
    return 1
  fi
}

# --- File list: ceda_url base + filename, local path from index.json ---
# Source: tools/rag/data_sources/datasets/index.json (ceda_url + files[])

declare -A CEDA_BASES=(
  ["datasets/WGI/spm_fig1"]="http://data.ceda.ac.uk/badc/ar6_wg1/data/spm/spm_01/v20221116/"
  ["datasets/WGI/spm_fig4"]="http://data.ceda.ac.uk/badc/ar6_wg1/data/spm/spm_04/v20210809/"
  ["datasets/WGI/spm_fig8"]="http://data.ceda.ac.uk/badc/ar6_wg1/data/spm/spm_08/v20210809/"
  ["datasets/WGI/spm_fig9"]="http://data.ceda.ac.uk/badc/ar6_wg1/data/spm/spm_09/v20220105/"
  ["datasets/WGI/ch6_fig12"]="http://data.ceda.ac.uk/badc/ar6_wg1/data/ch_06/ch6_fig12/v20220815/"
)

declare -A FILES
FILES["datasets/WGI/spm_fig1"]="panel_a/SPM1_1-2000_recon.csv panel_a/SPM1_1850-2020_obs.csv panel_a/spm1_6500_recon.csv panel_b/gmst_changes_model_and_obs.csv"
FILES["datasets/WGI/spm_fig4"]="panel_a/Carbon_dioxide_Gt_CO2_yr.csv panel_a/Methane_Mt_CO2_yr.csv panel_a/Nitrous_oxide_Mt_N2O_yr.csv panel_a/Sulfur_dioxide_Mt_SO2_yr.csv panel_b/ts_warming_ranges_1850-1900_base_panel_b.csv"
FILES["datasets/WGI/spm_fig8"]="panel_a/tas_global_Historical.csv panel_a/tas_global_SSP1_1_9.csv panel_a/tas_global_SSP1_2_6.csv panel_a/tas_global_SSP2_4_5.csv panel_a/tas_global_SSP3_7_0.csv panel_a/tas_global_SSP5_8_5.csv panel_b/sia_arctic_september_Historical.csv panel_b/sia_arctic_september_SSP1_1_9.csv panel_b/sia_arctic_september_SSP1_2_6.csv panel_b/sia_arctic_september_SSP2_4_5.csv panel_b/sia_arctic_september_SSP3_7_0.csv panel_b/sia_arctic_september_SSP5_8_5.csv panel_c/phos_global_Historical.csv panel_c/phos_global_SSP1_1_9.csv panel_c/phos_global_SSP1_2_6.csv panel_c/phos_global_SSP2_4_5.csv panel_c/phos_global_SSP3_7_0.csv panel_c/phos_global_SSP5_8_5.csv panel_d/global_sea_level_observed.csv panel_d/global_sea_level_projected.csv panel_e/global_sea_level_2300_assessed.csv"
FILES["datasets/WGI/spm_fig9"]="consolidated_data_figure_SPM.9.csv"
FILES["datasets/WGI/ch6_fig12"]="fig_em_based_ERF_GSAT_period_1750-2019_values_ERF.csv fig_em_based_ERF_GSAT_period_1750-2019_values_ERF_uncertainty.csv fig_em_based_ERF_GSAT_period_1750-2019_values_dT.csv fig_em_based_ERF_GSAT_period_1750-2019_values_dT_uncertainty.csv"

# --- Downloads ---
total=0; ok=0; fail=0; skipped=0

for dir_key in "${!CEDA_BASES[@]}"; do
  base_url="${CEDA_BASES[$dir_key]}"
  echo ""
  echo ">>> $dir_key"

  for relpath in ${FILES[$dir_key]}; do
    # relpath is either "filename.csv" or "panel_x/filename.csv"
    url="${base_url}${relpath}"
    outfile="$DATASETS_DIR/${dir_key}/${relpath}"
    ((total++)) || true

    if [[ -s "$outfile" ]]; then
      echo "    [skip] $relpath"
      ((skipped++)) || true
    else
      if download_file "$url" "$outfile"; then
        ((ok++)) || true
      else
        ((fail++)) || true
      fi
    fi
  done
done

unset CEDA_PASS

echo ""
echo "=== Summary: $ok downloaded, $skipped skipped, $fail failed (total: $total) ==="
if [[ $ok -gt 0 ]]; then
  echo "Next: node scripts/generate-dataset-summaries.mjs"
fi

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DATASETS_DIR="$PROJECT_ROOT/tools/rag/data_sources/datasets/WGI"

# --- Parse args ---
CEDA_USER=""
DEBUG=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --user|-u) CEDA_USER="$2"; shift 2 ;;
    --debug)   DEBUG=true; shift ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

# --- Check curl ---
if ! command -v curl &>/dev/null; then
  echo "ERROR: curl not found."
  exit 1
fi
echo "curl found: $(curl --version | head -1)"

# --- Credentials ---
if [[ -z "$CEDA_USER" ]]; then
  read -rp "CEDA username (email): " CEDA_USER
fi
read -rsp "CEDA password: " CEDA_PASS
echo ""

# --- Download a single CEDA directory ---
# Fetches the HTML index, extracts all .csv hrefs, downloads each file.
# Skips files that already exist and are non-empty.
download_dir() {
  local url="$1"
  local local_dir="$2"
  local label="$3"

  echo ""
  echo ">>> $label"
  echo "    URL   : $url"
  echo "    Local : $local_dir"

  mkdir -p "$local_dir"

  # Fetch HTML directory listing (follow redirects, silent, fail on HTTP errors)
  local html
  html=$(curl -sL --fail --user "$CEDA_USER:$CEDA_PASS" "$url")
  local curl_exit=$?

  if [[ $curl_exit -ne 0 ]]; then
    echo "    [FAILED] Could not fetch directory listing (exit $curl_exit)"
    echo "    -> Check credentials or try: curl -v --user user:pass $url"
    return 1
  fi

  if [[ "$DEBUG" == "true" ]]; then
    echo "    [DEBUG] First 15 lines of server response:"
    echo "$html" | head -15 | sed 's/^/    | /'
    echo ""
  fi

  # Extract CSV filenames from href attributes
  # Handles: href="file.csv" and href="./file.csv"
  local csv_files
  csv_files=$(echo "$html" | grep -oE 'href="[^"]*\.csv"' | sed 's/href="//;s/"//;s|^\./||')

  if [[ -z "$csv_files" ]]; then
    echo "    [WARNING] No CSV files found in directory listing"
    if [[ "$DEBUG" != "true" ]]; then
      echo "    -> Rerun with --debug to see the raw server response"
    fi
    echo "    -> Auth may have failed silently (CEDA uses a separate FTP password"
    echo "       from the web login - check: https://services.ceda.ac.uk/cedasite/myceda/user/accountdetails/)"
    return 0
  fi

  local count=0
  local skipped=0

  while IFS= read -r filename; do
    [[ -z "$filename" ]] && continue

    # Handle absolute vs relative filenames in href
    local basename_file
    basename_file=$(basename "$filename")
    local outfile="$local_dir/$basename_file"
    local fileurl="${url}${basename_file}"

    # Skip if file already exists and is non-empty
    if [[ -s "$outfile" ]]; then
      echo "    [skip] $basename_file (already present)"
      ((skipped++)) || true
      continue
    fi

    echo "    Downloading: $basename_file"
    curl -# -L --fail --user "$CEDA_USER:$CEDA_PASS" -o "$outfile" "$fileurl"

    if [[ $? -eq 0 ]]; then
      ((count++)) || true
    else
      echo "    [FAILED] $basename_file"
      rm -f "$outfile"  # Remove partial download
    fi
  done <<< "$csv_files"

  echo "    -> $count downloaded, $skipped skipped (already present)"
}

# --- Targets (5 figures from index.json) ---
TOTAL_OK=0

download_dir \
  "http://data.ceda.ac.uk/badc/ar6_wg1/data/spm/spm_01/v20221116/" \
  "$DATASETS_DIR/spm_fig1" \
  "SPM Fig.1 - GMST observations (1850-2020)" && ((TOTAL_OK++)) || true

download_dir \
  "http://data.ceda.ac.uk/badc/ar6_wg1/data/spm/spm_04/v20210809/" \
  "$DATASETS_DIR/spm_fig4" \
  "SPM Fig.4 - GHG scenarios SSP1-1.9 to SSP5-8.5" && ((TOTAL_OK++)) || true

download_dir \
  "http://data.ceda.ac.uk/badc/ar6_wg1/data/spm/spm_08/v20210809/" \
  "$DATASETS_DIR/spm_fig8" \
  "SPM Fig.8 - Long-term projections (temp, ice, pH, sea level)" && ((TOTAL_OK++)) || true

download_dir \
  "http://data.ceda.ac.uk/badc/ar6_wg1/data/spm/spm_09/v20220105/" \
  "$DATASETS_DIR/spm_fig9" \
  "SPM Fig.9 - Extreme events observed and projected" && ((TOTAL_OK++)) || true

download_dir \
  "http://data.ceda.ac.uk/badc/ar6_wg1/data/ch_06/ch6_fig12/v20220815/" \
  "$DATASETS_DIR/ch6_fig12" \
  "Ch6 Fig.12 - Radiative forcing ERF/GSAT (1750-2019)" && ((TOTAL_OK++)) || true

# Clear password from shell environment
unset CEDA_PASS

echo ""
echo "=== Done: $TOTAL_OK/5 directories processed ==="
echo "Next: node scripts/generate-dataset-summaries.mjs"
