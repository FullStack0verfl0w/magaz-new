import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { STORE_ADDRESS } from "~/utils/config";
import SyncStorage from "sync-storage";

const httpLink = new HttpLink({
	uri: `${STORE_ADDRESS}graphql`,
});

/**
 * Middleware operation
 * If we have a session token in localStorage, add it to the GraphQL request as a Session header.
 */
export const middleware = new ApolloLink((operation, forward) => {
	/**
	 * If session data exist in local storage, set value as session header.
	 */
	const session = SyncStorage.get("session");
	const auth = SyncStorage.get("auth");

	// console.log("HEY SESSION", session);
	// console.log("HEY AUTH", auth);

	if ( session && auth ) {
		operation.setContext(({ headers = {} }) => ({
			headers: {
				"woocommerce-session": `Session ${session}`,
				"Authorization": `Bearer ${auth}`,
			},
		}));
	}
	return forward(operation);
});

/**
 * Afterware operation
 * This catches the incoming session token and stores it in localStorage, for future GraphQL requests.
 */
export const afterware = new ApolloLink((operation, forward) => {
	return forward(operation).map((response) => {
		/**
		 * Check for session header and update session in local storage accordingly.
		 */
		const context = operation.getContext();
		const { response: { headers } } = context;
		const token = headers.get("woocommerce-session");

		if ( token ) {
			if ( SyncStorage.get("session") !== token ) {
				SyncStorage.set("session", token);
			}
		}

		return response;
	});
});

const client = new ApolloClient({
	link: middleware.concat(afterware.concat(httpLink)),
	cache: new InMemoryCache(),
	clientState: {},
});

export default client;