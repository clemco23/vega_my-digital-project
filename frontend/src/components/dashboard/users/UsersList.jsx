import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserRole,
} from "../../../services/user.service";
import "./UsersList.css";

const ROLE_OPTIONS = [
  { value: "USER", label: "Utilisateur" },
  { value: "ADMIN", label: "Administrateur" },
];

const formatAccountLabel = (user) =>
  [user.firstname, user.name].filter(Boolean).join(" ").trim() || user.email;

const readCurrentUserId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser = JSON.parse(window.localStorage.getItem("user") || "null");
    return storedUser?.id || null;
  } catch (error) {
    console.error("Impossible de lire l'utilisateur courant :", error);
    return null;
  }
};

const syncStoredUserRole = (updatedUser) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const storedUser = JSON.parse(window.localStorage.getItem("user") || "null");

    if (!storedUser || storedUser.id !== updatedUser.id) {
      return;
    }

    window.localStorage.setItem(
      "user",
      JSON.stringify({
        ...storedUser,
        role: updatedUser.role,
      })
    );
  } catch (error) {
    console.error("Impossible de synchroniser le rôle utilisateur :", error);
  }
};

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [savingUserId, setSavingUserId] = useState(null);
  const currentUserId = readCurrentUserId();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError("");
        const data = await getAllUsers();
        const nextUsers = Array.isArray(data)
          ? data.map((user) => ({
              ...user,
              initialRole: user.role,
            }))
          : [];

        setUsers(nextUsers);
      } catch (fetchError) {
        console.error("Impossible de charger les utilisateurs :", fetchError);
        setError("Impossible de charger les utilisateurs pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    void fetchUsers();
  }, []);

  const handleRoleChange = (userId, nextRole) => {
    setSuccessMessage("");
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, role: nextRole } : user
      )
    );
  };

  const handleSaveRole = async (user) => {
    try {
      setError("");
      setSuccessMessage("");
      setSavingUserId(user.id);

      const updatedUser = await updateUserRole(user.id, user.role);

      syncStoredUserRole(updatedUser);

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                ...updatedUser,
                initialRole: updatedUser.role,
              }
            : currentUser
        )
      );
      setSuccessMessage(
        `Le rôle de ${formatAccountLabel(updatedUser)} a été mis à jour.`
      );
    } catch (saveError) {
      console.error("Impossible de mettre à jour le rôle :", saveError);
      setError(
        saveError.response?.data?.message ||
          "Impossible de mettre à jour le rôle pour le moment."
      );
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? { ...currentUser, role: currentUser.initialRole }
            : currentUser
        )
      );
    } finally {
      setSavingUserId(null);
    }
  };

  if (loading) {
    return <p className="users-list__state">Chargement des utilisateurs...</p>;
  }

  if (error && users.length === 0) {
    return (
      <p className="users-list__state users-list__state--error">{error}</p>
    );
  }

  return (
    <section className="users-list">
      <div className="users-list__header">
        <div>
          <h2>Utilisateurs</h2>
          <p>Consultez les comptes et attribuez les droits administrateur.</p>
        </div>

        <span className="users-list__count">
          {users.length} utilisateur{users.length > 1 ? "s" : ""}
        </span>
      </div>

      {successMessage ? (
        <p className="users-list__state users-list__state--success">
          {successMessage}
        </p>
      ) : null}

      {error ? (
        <p className="users-list__state users-list__state--error">{error}</p>
      ) : null}

      {users.length === 0 ? (
        <p className="users-list__state">Aucun utilisateur pour le moment.</p>
      ) : (
        <div className="users-list__table-shell">
          <table className="users-list__table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Compte vérifié</th>
                <th>Inscription</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isCurrentUser = user.id === currentUserId;
                const isSaving = savingUserId === user.id;
                const hasPendingRoleChange = user.role !== user.initialRole;

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="users-list__identity">
                        <strong>{formatAccountLabel(user)}</strong>
                        {isCurrentUser ? (
                          <span className="users-list__hint">Votre compte</span>
                        ) : null}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="users-list__select"
                        value={user.role}
                        onChange={(event) =>
                          handleRoleChange(user.id, event.target.value)
                        }
                        disabled={isCurrentUser || isSaving}
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span
                        className={`users-list__badge ${user.verifiedAt ? "users-list__badge--success" : "users-list__badge--muted"}`}
                      >
                        {user.verifiedAt ? "Oui" : "Non"}
                      </span>
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="users-list__action"
                        onClick={() => handleSaveRole(user)}
                        disabled={isCurrentUser || !hasPendingRoleChange || isSaving}
                      >
                        {isSaving ? "Enregistrement..." : "Enregistrer"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default UsersList;

