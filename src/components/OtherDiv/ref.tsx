// Refer.tsx
import React, { useEffect, useState } from "react";
import "./ref.css";
import { getReferredUsersCount } from "../../firebaseFunctions";

interface ReferProps {
  userId: string;
}

const Refer: React.FC<ReferProps> = ({ userId }) => {
  const [referredCount, setReferredCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchReferredUsersCount = async () => {
      const count = await getReferredUsersCount(userId);
      setReferredCount(count);
    };

    fetchReferredUsersCount();
  }, [userId]);

  const inviteLink = `https://t.me/test12er69_bot?start=${userId}`;
  const shareLink = `https://t.me/share/url?url=https://t.me/test12er69_bot?start=${userId}`;

  const handleInviteClick = () => {
    window.Telegram.WebApp.openLink(shareLink);
  };

  return (
    <div>
      <h2 className="reftitle">Referral</h2>
      <button className="referbutton" onClick={handleInviteClick}>
        Invite Friends +
      </button>
      <p className="reflink">Your invite link:</p>
      <p className="refinvite">{inviteLink}</p>
      {referredCount !== null ? (
        <p className="refcount">Users referred: {referredCount}</p>
      ) : (
        <p className="refcount">Loading referred users count...</p>
      )}
    </div>
  );
};

export default Refer;
