export type NftDossier = {
  owner: string;
  public_metadata: Metadata;
  private_metadata: Metadata;
  display_private_metadata_error: string | null;
  royalty_info: RoyaltyInfo | null;
  mint_run_info: MintRunInfo;
  transferable: boolean;
  unwrapped: boolean;
  owner_is_public: boolean;
  public_ownership_expiration: string;
  private_metadata_is_public: boolean;
  private_metadata_is_public_expiration: string | null;
  token_approvals: Approval[];
  inventory_approvals: Approval[];
};

type Metadata = {
  token_uri: string | null;
  extension: Extension;
};

type Extension = {
  image: string | null;
  image_data: string | null;
  external_url: string | null;
  description: string;
  name: string;
  attributes: Attribute[];
  background_color: string | null;
  animation_url: string | null;
  youtube_url: string | null;
  media: string | null;
  protected_attributes: string | null;
  token_subtype: string;
};

type Attribute = {
  display_type: string | null;
  trait_type: string;
  value: string;
  max_value: string | null;
};

type RoyaltyInfo = {
  recipient: string;
  amount: string;
};

type MintRunInfo = {
  collection_creator: string;
  token_creator: string;
  time_of_minting: number;
  mint_run: string | null;
  serial_number: number | null;
  quantity_minted_this_run: number | null;
};

type Approval = {
  spender: string;
  permission: string;
};
