import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConversationList } from "../ConversationList";
import { ChatWindow } from "../ChatWindow";

const productQuestion = (product) =>
  product.title ? `"${product.title}" hakkında bilgi alabilir miyim?` : "Ürün hakkında bilgi alabilir miyim?";

export function ChatDialog() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product ?? null;

  const [partner, setPartner] = useState(() =>
    product?.userId ? { _id: product.userId, name: product.userName || "Satıcı" } : null
  );

  const clearProductState = useCallback(
    () => navigate(location.pathname, { replace: true, state: null }),
    [navigate, location.pathname]
  );

  const initialMessage = product && partner?._id === product.userId ? productQuestion(product) : null;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] bg-gray-100 dark:bg-gray-900">
      <ConversationList selectedUserId={partner?._id} onSelect={setPartner} />
      <ChatWindow
        key={partner?._id ?? "empty"}
        partner={partner}
        initialMessage={initialMessage}
        onInitialMessageSent={clearProductState}
      />
    </div>
  );
}
