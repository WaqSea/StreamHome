export interface ProfileEditLocationState {
  returnTo?: string;
}

export function profileEditUrl(profileId: string): string {
  return `/profiles/${encodeURIComponent(profileId)}/edit`;
}

export function profileEditReturnTarget(state: ProfileEditLocationState | null | undefined): string {
  const target = state?.returnTo;
  return target?.startsWith("/") && !target.startsWith("//") ? target : "/profiles";
}
