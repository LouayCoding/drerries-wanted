import { WantedPerson } from '@/types/wanted';
import wantedData from './wantedPersons.json';

export const wantedPersons: WantedPerson[] = wantedData as WantedPerson[];

// Original data as backup (commented out)
/*
export const wantedPersons: WantedPerson[] = [
  {
    id: '1',
    drerriesTag: 'ShadowReaper#6666',
    username: 'ShadowReaper',
    avatar: 'https://i.imgur.com/8YzQZQF.png',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    charges: [
      'Server Raiding',
      'Mass DM Spam',
      'Impersonation of Staff',
      'Distribution of Malicious Links'
    ],
    description: 'Bekend voor het coördineren van grootschalige server raids en het imiteren van moderators om vertrouwen te winnen. Is gelinkt aan meerdere phishing pogingen in verschillende Drerries communities. Extreem gevaarlijk en moet onmiddellijk gemeld worden.',
    lastSeen: 'Fantasy RP Server - 2 dagen geleden',
    reward: '50.000 Server Credits',
    dateIssued: '2025-01-05',
    evidence: [
      'Screenshot van raid coördinatie',
      'Phishing link bewijs',
      'Meerdere gebruikersrapporten'
    ],
    aliases: ['DarkReaper', 'ShadowLord', 'ReaperKing']
  },
  {
    id: '2',
    drerriesTag: 'ToxicTroll#1337',
    username: 'ToxicTroll',
    avatar: 'https://i.imgur.com/mXyupD1.png',
    status: 'ACTIVE',
    severity: 'HIGH',
    charges: [
      'Intimidatie',
      'Haatzaaien',
      'Ban Ontwijking',
      'Alt Accounts Aanmaken'
    ],
    description: 'Intimideert herhaaldelijk community leden en ontwijkt bans door meerdere alternatieve accounts aan te maken. Bekend voor toxisch gedrag en het verspreiden van haatzaaiende berichten in roleplay kanalen. Is verbannen van meer dan 15 servers.',
    lastSeen: 'Medieval RP Hub - 5 dagen geleden',
    reward: '25.000 Server Credits',
    dateIssued: '2025-01-03',
    evidence: [
      'Chat logs van intimidatie',
      'Lijst van bekende alt accounts',
      'Ban ontwijking bewijs'
    ],
    aliases: ['ToxicUser', 'TrollMaster', 'BannedUser123']
  },
  {
    id: '3',
    drerriesTag: 'ScammerPro#9999',
    username: 'ScammerPro',
    avatar: 'https://i.imgur.com/kJZWZSH.png',
    status: 'ACTIVE',
    severity: 'HIGH',
    charges: [
      'Oplichting',
      'Nep Nitro Giveaways',
      'Account Diefstal',
      'Financiële Fraude'
    ],
    description: 'Voert nep Nitro giveaways en phishing schema\'s uit om Drerries accounts en betalingsinformatie te stelen. Heeft meer dan 50 gebruikers opgelicht. Gebruikt geavanceerde social engineering tactieken.',
    lastSeen: 'Trading Server - 1 week geleden',
    reward: '35.000 Server Credits',
    dateIssued: '2024-12-28',
    evidence: [
      'Nep giveaway screenshots',
      'Slachtoffer verklaringen',
      'Phishing website links'
    ],
    aliases: ['NitroGiver', 'FreeNitro', 'GiveawayHost']
  },
  {
    id: '4',
    drerriesTag: 'RuleBreaker#4242',
    username: 'RuleBreaker',
    avatar: 'https://i.imgur.com/7GUdT8X.png',
    status: 'CAPTURED',
    severity: 'MEDIUM',
    charges: [
      'NSFW Content in SFW Kanalen',
      'Spammen',
      'Disrespect naar Staff'
    ],
    description: 'Plaatste herhaaldelijk ongepaste content in safe-for-work kanalen en toonde disrespect naar het moderatie team. Is gevangen en permanent verbannen van het netwerk.',
    lastSeen: 'Anime RP Server - 2 weken geleden',
    reward: '10.000 Server Credits (GECLAIMD)',
    dateIssued: '2024-12-20',
    evidence: [
      'NSFW content logs',
      'Staff interactie records'
    ],
    aliases: ['RuleIgnorer']
  },
  {
    id: '5',
    drerriesTag: 'MetaGamer#7777',
    username: 'MetaGamer',
    avatar: 'https://i.imgur.com/QvBK3GO.png',
    status: 'ACTIVE',
    severity: 'MEDIUM',
    charges: [
      'Metagaming',
      'Powergaming',
      'OOC Informatie Misbruik',
      'RP Ervaring Verpesten'
    ],
    description: 'Gebruikt consequent out-of-character informatie in roleplay scenario\'s, wat oneerlijke voordelen geeft. Weigert roleplay regels te volgen en verpest de ervaring voor andere spelers.',
    lastSeen: 'Sci-Fi RP Community - 3 dagen geleden',
    reward: '15.000 Server Credits',
    dateIssued: '2025-01-01',
    evidence: [
      'RP logs die metagaming tonen',
      'Meerdere speler klachten'
    ],
    aliases: ['PowerPlayer', 'MetaAbuser']
  },
  {
    id: '6',
    drerriesTag: 'BotSpammer#0001',
    username: 'BotSpammer',
    avatar: 'https://i.imgur.com/xKQpujG.png',
    status: 'ACTIVE',
    severity: 'LOW',
    charges: [
      'Bot Command Spam',
      'Kanaal Flooding',
      'Waarschuwingen Negeren'
    ],
    description: 'Spamt excessief bot commando\'s in publieke kanalen, wat normale gesprekken verstoort. Is meerdere keren gewaarschuwd maar blijft het gedrag vertonen.',
    lastSeen: 'Gaming Community - 1 dag geleden',
    reward: '5.000 Server Credits',
    dateIssued: '2025-01-07',
    evidence: [
      'Spam logs',
      'Waarschuwing geschiedenis'
    ],
    aliases: ['CommandSpammer']
  }
];
*/
