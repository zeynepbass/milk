import { QueryState } from "@/shared/components/molecules";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { ProfileCard } from "../ProfileCard";
import { ProfileTabs } from "../ProfileTabs";
import { MyPostsPanel } from "../MyPostsPanel";
import { AccountSettings } from "../AccountSettings";
import { OrganicForm } from "../OrganicForm";
import { SalesSupport } from "../SalesSupport";

export function Profile() {
  const query = useCurrentUser();
  const user = query.data;

  const tabs = user
    ? [
        { id: "posts", label: "Gönderiler", content: <MyPostsPanel canPost={user.role !== "alici"} /> },
        { id: "settings", label: "Hesap Ayarları", content: <AccountSettings /> },
        { id: "organic", label: "Organik Sertifika", content: <OrganicForm /> },
        { id: "feedback", label: "Geri Bildirim Gönder", content: <SalesSupport /> },
      ]
    : [];

  return (
    <QueryState query={query} isEmpty={!user}>
      {user && (
        <div className="grid grid-cols-12 gap-4 p-4">
          <div className="col-span-12 md:col-span-4">
            <ProfileCard user={user} />
          </div>
          <div className="col-span-12 md:col-span-8">
            <ProfileTabs tabs={tabs} />
          </div>
        </div>
      )}
    </QueryState>
  );
}
