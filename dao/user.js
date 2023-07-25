import { supabase } from "../lib/initSupabase";
import {
  FunctionsHttpError,
  FunctionsRelayError,
  FunctionsFetchError,
} from "@supabase/supabase-js";

export const deleteUser = async () => {
  const { data, error } = await supabase.functions.invoke("delete-user");
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      console.log("Function returned an error", errorMessage);
    } else if (error instanceof FunctionsRelayError) {
      console.log("Relay error:", error.message);
    } else if (error instanceof FunctionsFetchError) {
      console.log("Fetch error:", error.message);
    }
    throw error;
  }
  return data;
};
