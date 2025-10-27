import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthenticationScreen } from "../../features/authentication/screens/authentication.screen";
import { RegisterScreen } from "../../features/authentication/screens/register.screen";
import { LoginScreen } from "../../features/authentication/screens/login.screen";

const AuthStack = createStackNavigator();

export const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Authentication" component={AuthenticationScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
    );
};