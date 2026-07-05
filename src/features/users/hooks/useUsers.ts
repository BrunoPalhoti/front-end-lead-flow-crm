import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/features/users/api/users.api";
import { USERS_QUERY_KEY } from "@/features/users/api/queryKeys";

export { USERS_QUERY_KEY };

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: usersApi.getAll,
  });
}
