import Session from "~/shared/types/Session";

export default interface SessionPageProps {
  value: { session: Session } | null;
  error: string | null;
}
