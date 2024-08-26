import linkify from "npm:linkifyjs";
import linkifyStr from "npm:linkify-string";
import { nip19, nip21 } from "npm:nostr-tools";

linkify.registerCustomProtocol("nostr", true);

const mentions = [
  {
    id: "47259076c85f9240e852420d7213c95e95102f1de929fb60f33a2c32570c98c4",
    acct: "patrick@patrickdosreis.com",
    username: "patrick",
    url: "http://localhost:4036/@patrick@patrickdosreis.com",
  },
];

/** Get pubkey from decoded bech32 entity, or undefined if not applicable. */
function getDecodedPubkey(decoded: nip19.DecodeResult): string | undefined {
  switch (decoded.type) {
    case "npub":
      return decoded.data;
    case "nprofile":
      return decoded.data.pubkey;
  }
}

const noErrors =
  "nostr:npub1gujeqakgt7fyp6zjggxhyy7ft623qtcaay5lkc8n8gkry4cvnrzqd3f67z";
const withError =
  "nostr:npub1gujeqakgt7fyp6zjggxhyy7ft623qtcaay5lkc8n8gkry4cvnrzqd3f67z's";

linkifyStr(
  noErrors,
  {
    render: {
      url: ({ content }) => {
        const { decoded } = nip21.parse(content);
        const pubkey = getDecodedPubkey(decoded);
        if (pubkey) {
          const mention = mentions.find((m) => m.id === pubkey);
          const npub = nip19.npubEncode(pubkey);
          const acct = mention?.acct ?? npub;
          const name = mention?.acct ?? npub.substring(0, 8);
          const href = mention?.url ?? `localhost/@${acct}`;
          return `<span class="h-card"><a class="u-url mention" href="${href}" rel="ugc">@<span>${name}</span></a></span>`;
        } else return "";
      },
    },
  },
);
