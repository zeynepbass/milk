import { Avatar } from "@/shared/components/atoms";
import { EmptyState, LoadMore, Modal, QueryState } from "@/shared/components/molecules";
import { flattenPages } from "@/shared/query/infinite";
import { useFollowList } from "../../hooks/useFollow";

const TITLES = { followers: "Takipçiler", following: "Takip Ettiklerin" };

export function FollowListModal({ userId, relation, onClose }) {
  const query = useFollowList(userId, relation);
  const users = flattenPages(query.data);

  return (
    <Modal open={Boolean(relation)} onClose={onClose} title={TITLES[relation]} size="sm">
      <QueryState
        query={query}
        isEmpty={users.length === 0}
        empty={<EmptyState title="Liste boş" description="Burada henüz kimse yok." />}
      >
        <ul className="divide-y dark:divide-gray-700">
          {users.map((user) => (
            <li key={user._id} className="flex items-center gap-3 py-3">
              <Avatar user={user} size="sm" showBadge />
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {user.name} {user.surname}
              </span>
            </li>
          ))}
        </ul>
        <LoadMore query={query} />
      </QueryState>
    </Modal>
  );
}
