use std::{any::type_name, collections::HashMap, iter::Map};

use cosmwasm_std::{Addr, Api, BlockInfo, CanonicalAddr, StdError, StdResult, Storage};
use cosmwasm_storage::{PrefixedStorage, ReadonlyPrefixedStorage};
use schemars::JsonSchema;
use secret_toolkit::{
    serialization::{Bincode2, Json, Serde},
    storage::{AppendStore, Item, Keymap},
};
use serde::{de::DeserializeOwned, Deserialize, Serialize};

use crate::expiration::Expiration;
use crate::msg::{Tx, TxAction};

/// storage key for config
pub const CONFIG_KEY: &[u8] = b"config";
/// storage key for minters
pub const MINTERS_KEY: &[u8] = b"minters";
/// storage key for the contract instantiator
pub const CREATOR_KEY: &[u8] = b"creator";
/// storage key for the default RoyaltyInfo to use if none is supplied when minting
pub const DEFAULT_ROYALTY_KEY: &[u8] = b"defaultroy";
/// prefix for storage that maps ids to indices
pub const PREFIX_MAP_TO_INDEX: &[u8] = b"map2idx";
/// prefix for storage that maps indices to ids
pub const PREFIX_MAP_TO_ID: &[u8] = b"idx2id";
/// prefix for storage of token infos
pub const PREFIX_INFOS: &[u8] = b"infos";
/// prefix for the storage of public metadata
pub const PREFIX_PUB_META: &[u8] = b"publicmeta";
/// prefix for the storage of private metadata
pub const PREFIX_PRIV_META: &[u8] = b"privatemeta";
/// prefix for the storage of royalty information
pub const PREFIX_ROYALTY_INFO: &[u8] = b"royalty";
/// prefix for the storage of mint run information
pub const PREFIX_MINT_RUN: &[u8] = b"mintrun";
/// prefix for storage of txs
pub const PREFIX_TXS: &[u8] = b"rawtxs";
/// prefix for storage of owner's list of "all" permissions
pub const PREFIX_ALL_PERMISSIONS: &[u8] = b"allpermissions";
/// prefix for storage of owner's list of tokens permitted to addresses
pub const PREFIX_AUTHLIST: &[u8] = b"authlist";
/// prefix for storage of an address' ownership prvicacy
pub const PREFIX_OWNER_PRIV: &[u8] = b"ownerpriv";
/// prefix for the storage of the code hashes of contract's that have implemented ReceiveNft
pub const PREFIX_RECEIVERS: &[u8] = b"receivers";
/// prefix for the storage of mint run numbers
pub const PREFIX_MINT_RUN_NUM: &[u8] = b"runnum";
/// prefix for the storage of revoked permits
pub const PREFIX_REVOKED_PERMITS: &str = "revoke";

/// viewing key error message
pub const VIEWING_KEY_ERR_MSG: &str = "Wrong viewing key for this address or viewing key not set";

// append store for user's list of tx ids
pub static TX_ID_STORE: AppendStore<u64> = AppendStore::new(b"txid");

pub static ADMIN_KEY: &[u8] = b"admin";
pub static ADMIN: Item<CanonicalAddr> = Item::new(ADMIN_KEY);

// // Storage map for the walks, indexed by walk_name
// pub static WALKS_PUBLIC_KEY: &[u8] = b"walkspub";
// pub static WALKS_PUBLIC: Keymap<String, WalkPublicData> = Keymap::new(WALKS_PUBLIC_KEY);

// // Storage map for private data, indexed by walk_name
// pub static WALKS_PRIVATE_KEY: &[u8] = b"walkspriv";
// pub static WALKS_PRIVATE: Keymap<String, WalkPrivateData> = Keymap::new(WALKS_PRIVATE_KEY);

// // Struct for public walk data
// #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// pub struct WalkPublicData {
//     pub walk_name: String,
//     pub max_tickets: u32,
//     pub tickets_sold: u32,
// }

// #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// pub struct WalkPrivateData {
//     // pub required_checkpoints: HashMap<String, Checkpoint>,
//     // pub optional_checkpoints: HashMap<String, Checkpoint>,
//     pub checkpoint_order: Vec<String>,
//     pub badge_images: Vec<String>,
// }
// //
// // Struct for a single checkpoint's data
// #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// pub struct Checkpoint {
//     pub gps_coordinates: String,
//     pub hint: String,
// }

pub static WALK_NAME_KEY: &[u8] = b"walkname";
pub static WALK_NAME: Item<String> = Item::new(WALK_NAME_KEY);

pub static MAX_TICKETS_KEY: &[u8] = b"maxtics";
pub static MAX_TICKETS: Item<u32> = Item::new(MAX_TICKETS_KEY);

pub static TICKETS_SOLD_KEY: &[u8] = b"soldtics";
pub static TICKETS_SOLD: Item<u32> = Item::new(TICKETS_SOLD_KEY);

pub static CHECKPOINT_COORDS_KEY: &[u8] = b"checkcoords";
pub static CHECKPOINT_COORDS: Item<Vec<String>> = Item::new(CHECKPOINT_COORDS_KEY);

pub static CHECKPOINT_NAMES_KEY: &[u8] = b"checknames";
pub static CHECKPOINT_NAMES: Item<Vec<String>> = Item::new(CHECKPOINT_NAMES_KEY);

pub static CHECKPOINT_HINTS_KEY: &[u8] = b"checkhints";
pub static CHECKPOINT_HINTS: Item<Vec<String>> = Item::new(CHECKPOINT_HINTS_KEY);

pub static BADGE_IMAGES_KEY: &[u8] = b"images";
pub static BADGE_IMAGES: Item<Vec<String>> = Item::new(BADGE_IMAGES_KEY);

/// Token contract config
#[derive(Serialize, Debug, Deserialize, Clone, PartialEq, Eq)]
pub struct Config {
    /// name of token contract
    pub name: String,
    /// token contract symbol
    pub symbol: String,
    /// admin address
    pub admin: CanonicalAddr,
    /// count of mint ops
    pub mint_cnt: u32,
    /// count of tx
    pub tx_cnt: u64,
    /// token count
    pub token_cnt: u32,
    /// contract status
    pub status: u8,
    /// are token IDs/count public
    pub token_supply_is_public: bool,
    /// is ownership public
    pub owner_is_public: bool,
    /// is sealed metadata enabled
    pub sealed_metadata_is_enabled: bool,
    /// should Reveal unwrap to private metadata
    pub unwrap_to_private: bool,
    /// is a minter permitted to update a token's metadata
    pub minter_may_update_metadata: bool,
    /// is the token's owner permitted to update the token's metadata
    pub owner_may_update_metadata: bool,
    /// is burn enabled
    pub burn_is_enabled: bool,
}

/// tx type and specifics
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "snake_case")]
pub enum StoredTxAction {
    /// transferred token ownership
    Transfer {
        /// previous owner
        from: CanonicalAddr,
        /// optional sender if not owner
        sender: Option<CanonicalAddr>,
        /// new owner
        recipient: CanonicalAddr,
    },
    /// minted new token
    Mint {
        /// minter's address
        minter: CanonicalAddr,
        /// token's first owner
        recipient: CanonicalAddr,
    },
    /// burned a token
    Burn {
        /// previous owner
        owner: CanonicalAddr,
        /// burner's address if not owner
        burner: Option<CanonicalAddr>,
    },
}

/// tx in storage
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "snake_case")]
pub struct StoredTx {
    /// tx id
    pub tx_id: u64,
    /// the block containing this tx
    pub block_height: u64,
    /// the time (in seconds since 01/01/1970) of the block containing this tx
    pub block_time: u64,
    /// token id
    pub token_id: String,
    /// tx type and specifics
    pub action: StoredTxAction,
    /// optional memo
    pub memo: Option<String>,
}

impl StoredTx {
    /// Returns StdResult<Tx> from converting a stored tx to a displayable tx
    ///
    /// # Arguments
    ///
    /// * `api` - a reference to the Api used to convert human and canonical addresses
    pub fn into_humanized(self, api: &dyn Api) -> StdResult<Tx> {
        let action = match self.action {
            StoredTxAction::Transfer {
                from,
                sender,
                recipient,
            } => {
                let sndr = if let Some(s) = sender {
                    Some(api.addr_humanize(&s)?)
                } else {
                    None
                };
                TxAction::Transfer {
                    from: api.addr_humanize(&from)?,
                    sender: sndr,
                    recipient: api.addr_humanize(&recipient)?,
                }
            }
            StoredTxAction::Mint { minter, recipient } => TxAction::Mint {
                minter: api.addr_humanize(&minter)?,
                recipient: api.addr_humanize(&recipient)?,
            },
            StoredTxAction::Burn { owner, burner } => {
                let bnr = if let Some(b) = burner {
                    Some(api.addr_humanize(&b)?)
                } else {
                    None
                };
                TxAction::Burn {
                    owner: api.addr_humanize(&owner)?,
                    burner: bnr,
                }
            }
        };
        let tx = Tx {
            tx_id: self.tx_id,
            block_height: self.block_height,
            block_time: self.block_time,
            token_id: self.token_id,
            action,
            memo: self.memo,
        };

        Ok(tx)
    }
}

/// Returns StdResult<()> after storing tx
///
/// # Arguments
///
/// * `storage` - a mutable reference to the storage this item should go to
/// * `config` - a mutable reference to the contract Config
/// * `block` - a reference to the current BlockInfo
/// * `token_id` - token id being minted
/// * `from` - the previouis owner's address
/// * `sender` - optional address that sent the token
/// * `recipient` - the recipient's address
/// * `memo` - optional memo for the tx
#[allow(clippy::too_many_arguments)]
pub fn store_transfer(
    storage: &mut dyn Storage,
    config: &mut Config,
    block: &BlockInfo,
    token_id: String,
    from: CanonicalAddr,
    sender: Option<CanonicalAddr>,
    recipient: CanonicalAddr,
    memo: Option<String>,
) -> StdResult<()> {
    let action = StoredTxAction::Transfer {
        from,
        sender,
        recipient,
    };
    let tx = StoredTx {
        tx_id: config.tx_cnt,
        block_height: block.height,
        block_time: block.time.seconds(),
        token_id,
        action,
        memo,
    };
    let mut tx_store = PrefixedStorage::new(storage, PREFIX_TXS);
    json_save(&mut tx_store, &config.tx_cnt.to_le_bytes(), &tx)?;
    if let StoredTxAction::Transfer {
        from,
        sender,
        recipient,
    } = tx.action
    {
        append_tx_for_addr(storage, config.tx_cnt, &from)?;
        append_tx_for_addr(storage, config.tx_cnt, &recipient)?;
        if let Some(sndr) = sender.as_ref() {
            if *sndr != recipient {
                append_tx_for_addr(storage, config.tx_cnt, sndr)?;
            }
        }
    }
    config.tx_cnt += 1;
    Ok(())
}

/// Returns StdResult<()> after storing tx
///
/// # Arguments
///
/// * `storage` - a mutable reference to the storage this item should go to
/// * `config` - a mutable reference to the contract Config
/// * `block` - a reference to the current BlockInfo
/// * `token_id` - token id being minted
/// * `minter` - the minter's address
/// * `recipient` - the recipient's address
/// * `memo` - optional memo for the tx
pub fn store_mint(
    storage: &mut dyn Storage,
    config: &mut Config,
    block: &BlockInfo,
    token_id: String,
    minter: CanonicalAddr,
    recipient: CanonicalAddr,
    memo: Option<String>,
) -> StdResult<()> {
    let action = StoredTxAction::Mint { minter, recipient };
    let tx = StoredTx {
        tx_id: config.tx_cnt,
        block_height: block.height,
        block_time: block.time.seconds(),
        token_id,
        action,
        memo,
    };
    let mut tx_store = PrefixedStorage::new(storage, PREFIX_TXS);
    json_save(&mut tx_store, &config.tx_cnt.to_le_bytes(), &tx)?;
    if let StoredTxAction::Mint { minter, recipient } = tx.action {
        append_tx_for_addr(storage, config.tx_cnt, &recipient)?;
        if recipient != minter {
            append_tx_for_addr(storage, config.tx_cnt, &minter)?;
        }
    }
    config.tx_cnt += 1;
    Ok(())
}

/// Returns StdResult<()> after storing tx
///
/// # Arguments
///
/// * `storage` - a mutable reference to the storage this item should go to
/// * `config` - a mutable reference to the contract Config
/// * `block` - a reference to the current BlockInfo
/// * `token_id` - token id being minted
/// * `owner` - the previous owner's address
/// * `burner` - optional address that burnt the token
/// * `memo` - optional memo for the tx
pub fn store_burn(
    storage: &mut dyn Storage,
    config: &mut Config,
    block: &BlockInfo,
    token_id: String,
    owner: CanonicalAddr,
    burner: Option<CanonicalAddr>,
    memo: Option<String>,
) -> StdResult<()> {
    let action = StoredTxAction::Burn { owner, burner };
    let tx = StoredTx {
        tx_id: config.tx_cnt,
        block_height: block.height,
        block_time: block.time.seconds(),
        token_id,
        action,
        memo,
    };
    let mut tx_store = PrefixedStorage::new(storage, PREFIX_TXS);
    json_save(&mut tx_store, &config.tx_cnt.to_le_bytes(), &tx)?;
    if let StoredTxAction::Burn { owner, burner } = tx.action {
        append_tx_for_addr(storage, config.tx_cnt, &owner)?;
        if let Some(bnr) = burner.as_ref() {
            append_tx_for_addr(storage, config.tx_cnt, bnr)?;
        }
    }
    config.tx_cnt += 1;
    Ok(())
}

/// Returns StdResult<()> after saving tx id
///
/// # Arguments
///
/// * `storage` - a mutable reference to the storage this item should go to
/// * `tx_id` - the tx id to store
/// * `address` - a reference to the address for which to store this tx id
fn append_tx_for_addr(
    storage: &mut dyn Storage,
    tx_id: u64,
    address: &CanonicalAddr,
) -> StdResult<()> {
    let addr_store = TX_ID_STORE.add_suffix(address.as_slice());
    addr_store.push(storage, &tx_id)
}

/// Returns StdResult<(Vec<Tx>, u64)> of the txs to display and the total count of txs
///
/// # Arguments
///
/// * `api` - a reference to the Api used to convert human and canonical addresses
/// * `storage` - a reference to the contract's storage
/// * `address` - a reference to the address whose txs to display
/// * `page` - page to start displaying
/// * `page_size` - number of txs per page
pub fn get_txs(
    api: &dyn Api,
    storage: &dyn Storage,
    address: &CanonicalAddr,
    page: u32,
    page_size: u32,
) -> StdResult<(Vec<Tx>, u64)> {
    let addr_store = TX_ID_STORE.add_suffix(address.as_slice());

    let count = addr_store.get_len(storage)? as u64;
    // access tx storage
    let tx_store = ReadonlyPrefixedStorage::new(storage, PREFIX_TXS);
    // Take `page_size` txs starting from the latest tx, potentially skipping `page * page_size`
    // txs from the start.
    let txs: StdResult<Vec<Tx>> = addr_store
        .iter(storage)?
        .rev()
        .skip((page * page_size) as usize)
        .take(page_size as usize)
        .map(|id| {
            id.and_then(|id| {
                json_load(&tx_store, &id.to_le_bytes())
                    .and_then(|tx: StoredTx| tx.into_humanized(api))
            })
        })
        .collect();

    txs.map(|t| (t, count))
}

/// permission to view token info/transfer tokens
#[derive(Serialize, Deserialize, Clone, PartialEq, Eq, Debug)]
pub struct Permission {
    /// permitted address
    pub address: CanonicalAddr,
    /// list of permission expirations for this address
    pub expirations: [Option<Expiration>; 3],
}

/// permission types
#[derive(Serialize, Deserialize, Debug)]
pub enum PermissionType {
    ViewOwner,
    ViewMetadata,
    Transfer,
}

impl PermissionType {
    /// Returns usize representation of the enum variant
    pub fn to_usize(&self) -> usize {
        match self {
            PermissionType::ViewOwner => 0,
            PermissionType::ViewMetadata => 1,
            PermissionType::Transfer => 2,
        }
    }

    /// returns the number of permission types
    pub fn num_types(&self) -> usize {
        3
    }
}

/// list of one owner's tokens authorized to a single address
#[derive(Serialize, Deserialize, Debug)]
pub struct AuthList {
    /// whitelisted address
    pub address: CanonicalAddr,
    /// lists of tokens address has access to
    pub tokens: [Vec<u32>; 3],
}

/// a contract's code hash and whether they implement BatchReceiveNft
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ReceiveRegistration {
    /// code hash of the contract
    pub code_hash: String,
    /// true if the contract implements BatchReceiveNft
    pub impl_batch: bool,
}

/// Returns StdResult<()> resulting from saving an item to storage
///
/// # Arguments
///
/// * `storage` - a mutable reference to the storage this item should go to
/// * `key` - a byte slice representing the key to access the stored item
/// * `value` - a reference to the item to store
pub fn save<T: Serialize>(storage: &mut dyn Storage, key: &[u8], value: &T) -> StdResult<()> {
    storage.set(key, &Bincode2::serialize(value)?);
    Ok(())
}

/// Removes an item from storage
///
/// # Arguments
///
/// * `storage` - a mutable reference to the storage this item is in
/// * `key` - a byte slice representing the key that accesses the stored item
pub fn remove(storage: &mut dyn Storage, key: &[u8]) {
    storage.remove(key);
}

/// Returns StdResult<T> from retrieving the item with the specified key.  Returns a
/// StdError::NotFound if there is no item with that key
///
/// # Arguments
///
/// * `storage` - a reference to the storage this item is in
/// * `key` - a byte slice representing the key that accesses the stored item
pub fn load<T: DeserializeOwned>(storage: &dyn Storage, key: &[u8]) -> StdResult<T> {
    Bincode2::deserialize(
        &storage
            .get(key)
            .ok_or_else(|| StdError::not_found(type_name::<T>()))?,
    )
}

/// Returns StdResult<Option<T>> from retrieving the item with the specified key.
/// Returns Ok(None) if there is no item with that key
///
/// # Arguments
///
/// * `storage` - a reference to the storage this item is in
/// * `key` - a byte slice representing the key that accesses the stored item
pub fn may_load<T: DeserializeOwned>(storage: &dyn Storage, key: &[u8]) -> StdResult<Option<T>> {
    match storage.get(key) {
        Some(value) => Bincode2::deserialize(&value).map(Some),
        None => Ok(None),
    }
}

/// Returns StdResult<()> resulting from saving an item to storage using Json (de)serialization
/// because bincode2 annoyingly uses a float op when deserializing an enum
///
/// # Arguments
///
/// * `storage` - a mutable reference to the storage this item should go to
/// * `key` - a byte slice representing the key to access the stored item
/// * `value` - a reference to the item to store
pub fn json_save<T: Serialize>(storage: &mut dyn Storage, key: &[u8], value: &T) -> StdResult<()> {
    storage.set(key, &Json::serialize(value)?);
    Ok(())
}

/// Returns StdResult<T> from retrieving the item with the specified key using Json
/// (de)serialization because bincode2 annoyingly uses a float op when deserializing an enum.
/// Returns a StdError::NotFound if there is no item with that key
///
/// # Arguments
///
/// * `storage` - a reference to the storage this item is in
/// * `key` - a byte slice representing the key that accesses the stored item
pub fn json_load<T: DeserializeOwned>(storage: &dyn Storage, key: &[u8]) -> StdResult<T> {
    Json::deserialize(
        &storage
            .get(key)
            .ok_or_else(|| StdError::not_found(type_name::<T>()))?,
    )
}

/// Returns StdResult<Option<T>> from retrieving the item with the specified key using Json
/// (de)serialization because bincode2 annoyingly uses a float op when deserializing an enum.
/// Returns Ok(None) if there is no item with that key
///
/// # Arguments
///
/// * `storage` - a reference to the storage this item is in
/// * `key` - a byte slice representing the key that accesses the stored item
pub fn json_may_load<T: DeserializeOwned>(
    storage: &dyn Storage,
    key: &[u8],
) -> StdResult<Option<T>> {
    match storage.get(key) {
        Some(value) => Json::deserialize(&value).map(Some),
        None => Ok(None),
    }
}
