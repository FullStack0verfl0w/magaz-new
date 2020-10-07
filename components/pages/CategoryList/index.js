import React, { useState, useContext, useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { stateContext, dispatchContext } from "../../../contexts";
import OurActivityIndicator from "../../OurActivityIndicator";
import CategoryItem from "./CategoryItem";
import styles from "./styles";

import config from "../../../config";

import {
    SetCategoriesList,
} from "../../../actions";
import { FlatList } from "react-native-gesture-handler";
import { getCategoryListQuery } from "../../../queries";
import { addCategory, getDBCategoryList } from "../../../db_handler";

const address = config.getCell("StoreAddress");

/**Список категорий товаров*/
// TODO abort fetch in case of change of page
const CategoryList = (props) =>
{
    const { navigation } = props;

    const GetCategoryItem = ({item}) => {
        return (
            <CategoryItem navigation={navigation} name={item.name} id={item.productCategoryId} imageUrl={item?.image?.mediaDetails?.file} cached={item.cached}/>
        )
    };

    const state = useContext(stateContext);
    const dispatch = useContext(dispatchContext);
    
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const onMount = () => {

        // let controller = new AbortController();
        console.log(`In category list onMount`)

        if ( !state?.categories?.length ) {
            getDBCategoryList( (tr, result) => {
                let data = [];
                for (let i=0; i<=result.rows.length; i++) {
                    const row = result.rows.item(i);

                    if (row)
                        data.push({
                            name: row.name,
                            productCategoryId: row.productCategoryId,
                            image: {
                                mediaDetails: {
                                    file: row.imageLink,
                                }
                            },
                            cached: true,
                        });
                }
                dispatch(SetCategoriesList(data));
                setLoading(false);
            });

            
            fetch(`${address}graphql`, {
                // signal: controller.signal,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: getCategoryListQuery(),
            })
            .then(res => res.json())
            .then( ({data}) => {
                data?.productCategories?.nodes?.map( (v, i) => {
                    addCategory(v.name, v.productCategoryId, v.image?.mediaDetails?.file);
                });
                dispatch(SetCategoriesList(data?.productCategories?.nodes));
                setLoading(false);
            })
            .catch(err => setError(true));
        }

        // if(controller)
        //     return ()=>controller.abort()

    };

    useEffect( onMount, []);


    return (
        <>
            <LinearGradient
                style={styles.background}
                locations={[0, 1.0]}
                colors={['#078998', '#65B7B9']} />
           
            {
                ( loading || error) ?
                    <OurActivityIndicator error />
                    :
                    <FlatList
                        contentContainerStyle={{alignItems: "center", justifyContent: "center"}}
                        numColumns={2}
                        data={state.categories}
                        renderItem={GetCategoryItem}
                        keyExtractor={(item, key) => String(key)}/>
            }
        </>
    );
};

export default CategoryList;