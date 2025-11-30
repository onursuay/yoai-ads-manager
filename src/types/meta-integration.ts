export interface MetaPage {
  id: string;
  name: string;
}

export interface MetaBusiness {
  id: string;
  name: string;
}

export interface MetaInstagramAccount {
  id: string;
  username: string;
}

export interface MetaAdAccount {
  id: string;
  name: string;
  accountId: string;
}

export interface MetaConnectionPayload {
  pagesAccessMode: "all" | "selected";
  selectedPageIds: string[];
  businessAccessMode: "all" | "selected";
  selectedBusinessIds: string[];
  instagramAccessMode: "all" | "selected";
  selectedInstagramIds: string[];
  selectedAdAccountId: string;
}

