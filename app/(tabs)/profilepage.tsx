import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const placeholder_avatar = "https://placehold.co/160x160/png?text=Avatar";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
            <Image
                source={require("../../assets/images/gabedoordec.png")}
                style={styles.avatar}
                accessibilityLabel="Profile picture"
                />
            <View style={styles.infoRow}>
                <View style={styles.infoBox} testID="usernameBox" accessible accessibilityLabel="Username">
                    <Text style={styles.infoLabel}>Username</Text>
                    <Text style={styles.infoValue}>@placeholder_user</Text>
                </View>
                <View style={styles.infoBox} testID="createdBox" accessible accessibilityLabel="Account created">
                    <Text style={styles.infoLabel}>Joined</Text>
                    <Text style={styles.infoValue}>Jan 1, 2025  </Text>
                </View>
            </View>   
        </View>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            testID="activityScroll"
            >
            {Array.from({length: 8}).map((_, i) => (
                <View key={i} style={styles.activityCard}>
                    <Text style={styles.activityTitle}>Activity #{i + 1}</Text>
                    <Text numberOfLines={2} style={styles.activitySubtitle}>This is where activity details will be rendered</Text>
                </View>
            ))}
        </ScrollView>
    </SafeAreaView>
  );
}

const avatar_size = 160;

const styles = StyleSheet.create({
    safe: {flex: 1, backgroundColor: "#fff"},
    header: {
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    avatar: {
        width: avatar_size,
        height: avatar_size,
        borderRadius: avatar_size / 2,
        backgroundColor: "#eee",
    },
    infoRow: {
        marginTop: 16,
        width: "100%",
        flexDirection: "row",
        gap: 12,
    },
    infoBox: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        backgroundColor: "#fafafa",
    },
    infoLabel: { fontSize: 12, color: "#666", marginBottom: 4},
    infoValue: { fontSize: 16, fontWeight: "600", color:"#111"},
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        gap: 12,
    },
    activityCard: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        backgroundColor: "#fff",
    },
    activityTitle: {fontSize: 16, fontWeight: "600", marginBottom: 4},
    activitySubtitle: {fontSize: 14, color: "#555"},
});
