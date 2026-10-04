// Épure - fake data for the "Try with sample data" button.
//
// For people who want to try the tool without their own file (recruiters, testers).
// Same format as a Chrome export. Every entry is fake.
// It is built so every feature has something to show:
//   - duplicates:  github.com and shop-online.fr appear twice
//   - weak:        adam123, password1, azerty123, qwerty
//   - reused:      hire-me123 on netflix, spotify and twitch
//   - empty:       old-forum.net and reddit.com have no password
//   - subdomains:  mail.google.com and accounts.google.com (try "Remove a site" with google.com)

const SAMPLE_CSV = `name,url,username,password,note
github.com,https://github.com/login,alex.martin@example.com,Gh7!qLm9#vT2,
netflix.com,https://www.netflix.com/login,alex.martin@example.com,hire-me123,
mail.google.com,https://mail.google.com,alex.martin@gmail.com,adam123,
amazon.fr,https://www.amazon.fr/ap/signin,alex.martin@example.com,password1,
github.com,https://github.com/login,alex.martin@example.com,Gh7!qLm9#vT2,
spotify.com,https://accounts.spotify.com,alexm,hire-me123,
leboncoin.fr,https://www.leboncoin.fr,alex.martin@example.com,azerty123,
accounts.google.com,https://accounts.google.com,alex.martin@gmail.com,Adam!2024secure,
shop-online.fr,https://shop-online.fr/account,a.martin@example.com,Sh0p!ng2023,
facebook.com,https://www.facebook.com,alex.martin@example.com,qwerty,
old-forum.net,https://old-forum.net/login,alexm,,
linkedin.com,https://www.linkedin.com/login,alex.martin@example.com,Lk#8vRw2pZ!x,
twitch.tv,https://www.twitch.tv,alexm_live,hire-me123,
shop-online.fr,https://shop-online.fr/account,a.martin@example.com,Sh0p!ng2023,
discord.com,https://discord.com/login,alexm,Disc0rd-Night!,
reddit.com,https://www.reddit.com/login,throwaway_alex,,`;


// Fake rows for the dark band that scrolls on the home page (decoration only).
// "tag" is a translation key shown as a small coral label, or null for no label.
const RIBBON_ROWS = [
  { site: 'github.com',     user: 'marie@mail.com',    tag: null },
  { site: 'shop-online.fr', user: 'm.dupont@mail.com', tag: 'filterDuplicates' },
  { site: 'netflix.com',    user: 'marie@mail.com',    tag: 'filterReused' },
  { site: 'forum-old.net',  user: 'marie123',          tag: 'filterWeak' },
  { site: 'amazon.fr',      user: 'marie@mail.com',    tag: null },
  { site: 'site-test.com',  user: 'jean@mail.com',     tag: 'filterEmpty' },
  { site: 'github.com',     user: 'marie@mail.com',    tag: 'filterDuplicates' },
  { site: 'impots.gouv.fr', user: 'marie@mail.com',    tag: null },
];
