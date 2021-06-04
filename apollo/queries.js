import { gql } from "@apollo/client";

/**
 * GraphQL запрос на категории
 */
export const QUERY_CATEGORY_LIST = gql`
    query GetCategoryList($hideEmpty: Boolean!) {
        productCategories(where: {hideEmpty: $hideEmpty}) {
            nodes {
                name
                productCategoryId
                image {
                    mediaDetails {
                        file
                    }
                }
            }
        }
    }`;

export const QUERY_GET_PRODUCT = gql`
    query GetProduct( $id: ID! ) {
        product(id: $id, idType: DATABASE_ID) {
            description(format: RAW)
            galleryImages {
                nodes {
                    sourceUrl
                }
            }
            ... on SimpleProduct {
                price(format: FORMATTED)
                    stockQuantity
            }
            ... on VariableProduct {
                price(format: FORMATTED)
                    stockQuantity
                attributes {
                    nodes {
                        attributeId
                        name
                        options
                    }
                }
                variations {
                    nodes {
                        databaseId
                        name
                        price(format: FORMATTED)
                        stockQuantity
                        image {
                            sourceUrl
                        }
                        attributes {
                            nodes {
                                label
                                value
                            }
                        }
                    }
                }
            }
        }
    }
`;

/**
 * GraphQL запрос на список товаров
 */
export const QUERY_PRODUCT_LIST = gql`
    query GetProductListQuery($categoryId: Int!) {
        products(where: {categoryId: $categoryId}) {
            nodes {
                databaseId
                name
                shortDescription(format: RAW)
                image {
                    sourceUrl
                }
                galleryImages {
                    nodes {
                        sourceUrl
                    }
                }
                ... on VariableProduct {
                    price
                    stockQuantity
                    variations {
                        nodes {
                            price
                            databaseId
                            name
                        }
                    }
                    attributes {
                        nodes {
                            attributeId
                            name
                            options
                        }
                    }
                }
                ... on SimpleProduct {
                    price
                    stockQuantity
                }
            }
        }
    }`;

/**
 * GraphQL мутация для регистрации пользователя
 */
export const MUTATION_REGISTER_USER = gql`
    mutation RegisterUser($uuid: String!, $username: String!, $password: String!, $email: String!) {
        registerUser(
        input: {
            clientMutationId: $uuid,
            username: $username,
            password: $password,
            email: $email
        }) {
            user {
                jwtAuthToken
                jwtRefreshToken
            }
        }
    }
`;

/**
 * GraphQL мутация для входа
 */
export const MUTATION_LOGIN_USER = gql`
    mutation LoginUser($uuid: String!, $username: String!, $password: String!) {
        login( input: {
            clientMutationId: $uuid,
            username: $username,
            password: $password
        }) {
            authToken
            refreshToken
            user {
                databaseId
                username
                email
            }
        }
    }
`;

export const MUTATION_REFRESH_TOKEN = gql`
    mutation RefreshAuthToken( $clientMutationId: String!, $jwtRefreshToken: String! ) {
        refreshJwtAuthToken(
            input: {
                clientMutationId: $clientMutationId
                jwtRefreshToken: $jwtRefreshToken,
        }) {
            authToken
        }
    }
`;

export const MUTATION_CHECKOUT = gql`
    mutation Checkout(
            $clientMutationId: String!,
            $isPaid: Boolean!,
            $customerNote: String!,
            $address1: String!,
            $address2: String!,
            $country: CountriesEnum,
            $city: String!,
            $email: String!,
            $state: String!,
            $firstName: String!,
            $lastName: String!,
            $postcode: String!,
            $phone: String!,
            $paymentMethod: String!,
        ) {
        checkout( input: {
            clientMutationId: $clientMutationId,
            isPaid: $isPaid,
            paymentMethod: $paymentMethod,
            customerNote: $customerNote,
            billing: {
                address1: $address1,
                address2: $address2,
                city: $city,
                country: $country,
                email: $email,
                firstName: $firstName,
                lastName: $lastName,
                phone: $phone,
                postcode: $postcode,
                state: $state,
            }
        } ) {
            clientMutationId
        }
    }
`;

export const MUTATION_ADD_TO_CART = gql`
    mutation cartAdd($productId: Int!, $quantity: Int!, $clientMutationId: String!) {
        addToCart(input: { productId: $productId, quantity: $quantity, clientMutationId: $clientMutationId }){
            cartItem {
                key
                product {
                    node {
                        name
                    }
                }
                quantity
                subtotal
                subtotalTax
                tax
                total
            }
        }
    }
`;
export const MUTATION_ADD_TO_CART_WITH_VARIATION = gql`
    mutation cartAdd($productId: Int!, $quantity: Int!, $clientMutationId: String!, $variationId: Int!) {
        addToCart(input: { productId: $productId, quantity: $quantity, clientMutationId: $clientMutationId, variationId: $variationId }){
            cartItem {
                key
                product {
                    node {
                        name
                    }
                }
                quantity
                subtotal
                subtotalTax
                tax
                total
            }
        }
    }
`;

export const QUERY_GET_CART = gql`
    query getCart {
        cart {
            contents {
                nodes {
                    key
                    product {
                        node {
                            databaseId
                            name
                            image {
                                sourceUrl
                            }
                        }
                    }
                    quantity
                    total
                    variation {
                        node {
                            databaseId
                            name
                            price
                            image {
                                sourceUrl
                            }
                        }
                    }
                }
            }
            total
        }
    }
`;

export const MUTATION_UPDATE_PRODUCT_QUANTITY = gql`
    mutation updateProductQuantity( $clientMutationId: String!, $key: ID!, $quantity: Int! ) {
        updateItemQuantities( input: { clientMutationId: $clientMutationId, items: { key: $key, quantity: $quantity } } ) {
            clientMutationId
        }
    }
`;

export const MUTATION_DELETE_PRODUCT_FROM_CART = gql`
    mutation removeItemFromCart( $clientMutationId: String!, $keys: [ID!] ) {
        removeItemsFromCart( input: { clientMutationId: $clientMutationId, keys: $keys, all: false } ) {
            clientMutationId
        }
    }
`;

export const QUERY_GET_ORDERS = gql`
    query getOrders {
        orders {
            nodes {
                databaseId
                orderKey
                total
                status
            }
        }
    }
`;

export const QUERY_GET_ORDER = gql`
    query MyQuery( $id: ID! ) {
        order(id: $id, idType: DATABASE_ID) {
            lineItems {
                nodes {
                    databaseId
                    product {
                        databaseId
                        name
                        image {
                            sourceUrl
                        }
                        ... on SimpleProduct {
                            price(format: FORMATTED)
                        }
                        ... on VariableProduct {
                            price(format: FORMATTED)
                        }
                    }
                    variation {
                        databaseId
                        name
                        price(format: FORMATTED)
                        image {
                            sourceUrl
                        }
                    }
                    quantity
                }
            }
            status
            billing {
                address1
                address2
                city
                country
                email
                firstName
                lastName
                phone
                postcode
                state
            }
        }
    }
`;