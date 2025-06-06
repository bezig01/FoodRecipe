import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
  } from "react-native";
  import React from "react";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import { useDispatch, useSelector } from "react-redux";
  import { toggleFavorite } from "../redux/favoritesSlice";
  
  export default function CustomRecipesScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
  
    const route = useRoute();
    const { recipe } = route.params || {}; // Pass the  object as a parameter
    console.log('recipe',recipe);
    
    const favoriteRecipe = useSelector(
      (state) => state.favorites.favoriterecipes
    );
    console.log('favoriteRecipe from custom',favoriteRecipe);
    
    // Check if this custom recipe is in favorites by comparing title (since custom recipes don't have idFood)
    const isFavourite = favoriteRecipe.some(
      (favRecipe) => favRecipe.title === recipe.title
    );
  
    if (!recipe) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>No Recipe Details Available</Text>
        </View>
      );
    }
  
    const handleToggleFavorite = () => {
      dispatch(toggleFavorite(recipe)); // Adjust the action to handle recipe
    };

    // Prepare data for FlatList
    const sections = [
      {
        type: 'header',
        data: {
          image: recipe.image,
          title: recipe.title
        }
      },
      {
        type: 'content',
        data: recipe.description
      }
    ];

    const renderSection = ({ item }) => {
      switch (item.type) {
        case 'header':
          return (
            <View>
              {/* Recipe Image */}
              <View style={styles.imageContainer} testID="imageContainer">
                {item.data.image && (
                  <Image source={{ uri: item.data.image }} style={styles.recipeImage} />
                )}
              </View>
              <View
                style={styles.topButtonsContainer} testID="topButtonsContainer"
              >
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Text>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleToggleFavorite}
                  style={styles.favoriteButton}
                >
                  <Text>{isFavourite ? "♥" : "♡"}</Text>
                </TouchableOpacity>
              </View>

              {/* Recipe Details */}
              <View style={styles.contentContainer} testID="contentContainer">
                <Text style={styles.recipeTitle}>{item.data.title}</Text>
              </View>
            </View>
          );

        case 'content':
          return (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Content</Text>
              <Text style={styles.contentText}>{item.data}</Text>
            </View>
          );

        default:
          return null;
      }
    };
  
    return (
      <FlatList
        style={styles.container}
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        testID="flatListContent"
      />
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    flatListContent: {
      paddingBottom: 30,
    },
    imageContainer: {
      flexDirection: "row",
      justifyContent: "center",
    },
    recipeImage: {
      width: wp(98),
      height: hp(50),
      borderRadius: 35,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      marginTop: 4,
    },
    contentContainer: {
      paddingHorizontal: wp(4),
      paddingTop: hp(4),
    },
    recipeTitle: {
      fontSize: hp(3),
      fontWeight: "bold",
      color: "#4B5563",
      marginBottom: hp(2),
    },
    sectionContainer: {
      marginBottom: hp(2),
    },
    sectionTitle: {
      fontSize: hp(2.5),
      fontWeight: "bold",
      color: "#4B5563",
      marginBottom: hp(1),
    },
    topButtonsContainer: {
      width: "100%",
      position: "absolute",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: hp(4),
    },
    backButton: {
      padding: 8,
      borderRadius: 50,
      marginLeft: wp(5),
      backgroundColor: "white",
    },
    favoriteButton: {
      padding: 8,
      borderRadius: 50,
      marginRight: wp(5),
      backgroundColor: "white",
    },
    contentText: {
      fontSize: hp(1.6),
      color: "#4B5563",
    },
  });
  