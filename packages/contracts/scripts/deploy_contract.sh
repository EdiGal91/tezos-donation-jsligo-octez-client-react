#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CONTRACT_PATH="$SCRIPT_DIR/../dist/donation.tz"
STORAGE_PATH="$SCRIPT_DIR/../dist/initial_storage.tz"
WALLET_ALIAS="temple_wallet"

octez-client originate contract donation transferring 0 from $WALLET_ALIAS \
  running $CONTRACT_PATH --init "$(cat $STORAGE_PATH)" --burn-cap 0.257
