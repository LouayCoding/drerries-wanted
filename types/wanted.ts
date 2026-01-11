export interface WantedPerson {
  id: string;
  drerriesTag: string;
  username: string;
  avatar: string;
  status: 'ACTIVE' | 'CAPTURED' | 'CLEARED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  charges: string[];
  description: string;
  lastSeen: string;
  reward: string;
  dateIssued: string;
  evidence?: string[];
  aliases?: string[];
}

export interface Report {
  id: string;
  reported_user_id: string;
  reported_username: string;
  reported_tag: string;
  reported_avatar: string;
  reporter_id?: string;
  reason: string;
  media_urls: string[];
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED';
  created_at: string;
}

export interface DeletedMessage {
  id: string;
  message_id: string;
  author_id: string;
  author_username: string;
  author_tag: string;
  author_avatar: string;
  content: string;
  attachments: string[];
  embeds: any[];
  channel_id: string;
  channel_name: string;
  deleted_at: string;
  original_timestamp: string;
}

export interface GuildMember {
  id: string;
  username: string;
  discriminator: string;
  tag: string;
  avatar: string;
}

export interface EditedMessage {
  id: string;
  message_id: string;
  author_id: string;
  author_username: string;
  author_tag: string;
  author_avatar: string;
  old_content: string;
  new_content: string;
  channel_id: string;
  channel_name: string;
  edited_at: string;
  original_timestamp: string;
}

export interface UserHistory {
  id: string;
  user_id: string;
  change_type: 'USERNAME' | 'AVATAR' | 'DISCRIMINATOR' | 'NICKNAME';
  old_value: string;
  new_value: string;
  changed_at: string;
  guild_id?: string;
}

export interface VoiceActivity {
  id: string;
  user_id: string;
  username: string;
  channel_id: string;
  channel_name: string;
  joined_at: string;
  left_at: string | null;
  duration_seconds: number | null;
}

export interface VoiceStats {
  total_hours: number;
  top_users: Array<{
    user_id: string;
    username: string;
    total_seconds: number;
  }>;
  peak_hours: Array<{
    hour: number;
    count: number;
  }>;
  channel_stats: Array<{
    channel_name: string;
    total_sessions: number;
  }>;
}

export interface WhitelistedUser {
  id: string;
  user_id: string;
  username: string;
  added_at: string;
  added_by: string;
  notes?: string;
}

export interface ReportWithDetails extends Report {
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
  reporter_username?: string;
}