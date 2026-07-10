import {
    AlertTriangle,
    ArrowRight,
    ArrowUpRight,
    Locate,
    MapPin,
    Search,
    X,
} from "lucide-react-native";
import { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const G = {
  bg: "#FAFAF7",
  white: "#FFFFFF",
  charcoal: "#171A18",
  muted: "#737A78",
  border: "#D9E2DE",
  gold: "#F6AE16",
  goldLight: "#FFF3D1",
  blue: "#2563EB",
};

const ranks = [
  { id: 1, name: "Mamelodi Rank", latitude: -25.7077, longitude: 28.3658 },
  { id: 2, name: "Denneboom Rank", latitude: -25.7208, longitude: 28.3365 },
  { id: 3, name: "Pretoria CBD Rank", latitude: -25.7461, longitude: 28.1881 },
];

const popularRoutes = [
  { from: "Mamelodi", to: "Pretoria CBD", fare: "R18" },
  { from: "Denneboom", to: "Hatfield", fare: "R15" },
  { from: "Pretoria CBD", to: "Soshanguve", fare: "R25" },
];

export default function HomeScreen() {
  const [sheet, setSheet] = useState<"closed" | "search" | "results">("closed");

  return (
    <View style={{ flex: 1, backgroundColor: G.bg }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -25.7313,
          longitude: 28.2184,
          latitudeDelta: 0.12,
          longitudeDelta: 0.12,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {ranks.map((rank) => (
          <Marker
            key={rank.id}
            coordinate={{
              latitude: rank.latitude,
              longitude: rank.longitude,
            }}
            title={rank.name}
            onPress={() => setSheet("results")}
            pinColor={G.gold}
          />
        ))}
      </MapView>

      <View
        style={{
          position: "absolute",
          top: 48,
          left: 16,
          right: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.94)",
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderRadius: 18,
          }}
        >
          <Text
            style={{
              fontFamily: "PlusJakartaSans_800ExtraBold",
              fontSize: 19,
              letterSpacing: -0.8,
              color: G.charcoal,
            }}
          >
            kombi
          </Text>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 99,
              backgroundColor: G.gold,
              marginLeft: 3,
              marginTop: 8,
            }}
          />
        </View>

        <Pressable
          style={{
            width: 42,
            height: 42,
            borderRadius: 99,
            backgroundColor: G.charcoal,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "PlusJakartaSans_800ExtraBold",
              color: G.white,
            }}
          >
            B
          </Text>
        </Pressable>
      </View>

      {sheet === "closed" && (
        <>
          <Pressable
            onPress={() => setSheet("search")}
            style={{
              position: "absolute",
              top: 108,
              left: 16,
              right: 16,
              backgroundColor: G.white,
              borderRadius: 22,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              elevation: 6,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                backgroundColor: G.goldLight,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Search size={18} color={G.gold} />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "PlusJakartaSans_800ExtraBold",
                  fontSize: 18,
                  color: G.charcoal,
                }}
              >
                Where to?
              </Text>
              <Text
                style={{
                  fontFamily: "PlusJakartaSans_500Medium",
                  fontSize: 12,
                  color: G.muted,
                  marginTop: 2,
                }}
              >
                Search destination, rank, or city
              </Text>
            </View>

            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 13,
                backgroundColor: G.gold,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowUpRight size={17} color={G.white} />
            </View>
          </Pressable>

          <View
            style={{
              position: "absolute",
              top: 190,
              left: 16,
              right: 16,
              backgroundColor: "rgba(254,243,199,0.96)",
              borderRadius: 16,
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AlertTriangle size={15} color={G.gold} />
            <Text
              style={{
                flex: 1,
                fontFamily: "PlusJakartaSans_600SemiBold",
                fontSize: 12,
                color: "#92400E",
              }}
            >
              High traffic near Pretoria CBD. Expect longer wait times.
            </Text>
            <X size={14} color={G.muted} />
          </View>

          <Pressable
            style={{
              position: "absolute",
              right: 16,
              bottom: 28,
              width: 46,
              height: 46,
              borderRadius: 99,
              backgroundColor: G.white,
              alignItems: "center",
              justifyContent: "center",
              elevation: 5,
            }}
          >
            <Locate size={21} color={G.blue} />
          </Pressable>
        </>
      )}

      <SearchSheet
        visible={sheet === "search"}
        onClose={() => setSheet("closed")}
        onResult={() => setSheet("results")}
      />

      <ResultsSheet
        visible={sheet === "results"}
        onClose={() => setSheet("closed")}
      />
    </View>
  );
}

function SearchSheet({
  visible,
  onClose,
  onResult,
}: {
  visible: boolean;
  onClose: () => void;
  onResult: () => void;
}) {
  const [mode, setMode] = useState<"Local" | "Town" | "Long Distance">("Town");

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.22)" }}
      />

      <View
        style={{
          maxHeight: "82%",
          backgroundColor: G.white,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: 12,
          paddingHorizontal: 16,
          paddingBottom: 28,
        }}
      >
        <View
          style={{
            alignSelf: "center",
            width: 42,
            height: 5,
            borderRadius: 99,
            backgroundColor: G.border,
            marginBottom: 14,
          }}
        />

        <View
          style={{
            backgroundColor: G.bg,
            borderColor: G.border,
            borderWidth: 1,
            borderRadius: 18,
            paddingHorizontal: 14,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Search size={18} color={G.muted} />
          <TextInput
            placeholder="Search destination, taxi rank, town or city"
            placeholderTextColor={G.muted}
            style={{
              flex: 1,
              fontFamily: "PlusJakartaSans_500Medium",
              color: G.charcoal,
            }}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
          {(["Local", "Town", "Long Distance"] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() => setMode(item)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: mode === item ? G.gold : G.border,
                backgroundColor: mode === item ? G.gold : G.white,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "PlusJakartaSans_800ExtraBold",
                  fontSize: 12,
                  color: mode === item ? G.white : G.muted,
                }}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView style={{ marginTop: 16 }}>
          <Row
            icon={<Locate size={17} color={G.blue} />}
            title="Use current location"
            subtitle="Find nearest rank from where you are"
            onPress={onResult}
          />

          <Section title="Nearby Ranks" />
          {ranks.map((rank) => (
            <Row
              key={rank.id}
              icon={<MapPin size={17} color={G.gold} />}
              title={rank.name}
              subtitle="Available taxi routes nearby"
              onPress={onResult}
            />
          ))}

          <Section title="Popular Routes" />
          {popularRoutes.map((route) => (
            <Row
              key={route.to}
              icon={<ArrowRight size={17} color={G.charcoal} />}
              title={`${route.from} → ${route.to}`}
              subtitle={`Estimated fare ${route.fare}`}
              onPress={onResult}
            />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

function ResultsSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View
          style={{
            maxHeight: "65%",
            backgroundColor: G.white,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 16,
            paddingBottom: 28,
          }}
        >
          <View
            style={{
              alignSelf: "center",
              width: 42,
              height: 5,
              borderRadius: 99,
              backgroundColor: G.border,
              marginBottom: 14,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "PlusJakartaSans_800ExtraBold",
                  fontSize: 18,
                  color: G.charcoal,
                }}
              >
                Route options
              </Text>
              <Text
                style={{
                  fontFamily: "PlusJakartaSans_500Medium",
                  fontSize: 12,
                  color: G.muted,
                }}
              >
                Mamelodi East → Pretoria CBD
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 99,
                backgroundColor: G.bg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={17} color={G.muted} />
            </Pressable>
          </View>

          {[
            ["Fastest", "Denneboom Rank → Pretoria CBD", "R18 · 12 min wait"],
            ["Cheapest", "Mamelodi Rank → CBD", "R15 · 18 min wait"],
            ["Long Distance", "CBD → Johannesburg", "R85 · 25 min wait"],
          ].map(([label, title, subtitle]) => (
            <Pressable
              key={label}
              style={{
                borderWidth: 1,
                borderColor: G.border,
                borderRadius: 18,
                padding: 14,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  alignSelf: "flex-start",
                  fontFamily: "PlusJakartaSans_800ExtraBold",
                  fontSize: 10,
                  color: G.gold,
                  marginBottom: 6,
                }}
              >
                {label}
              </Text>
              <Text
                style={{
                  fontFamily: "PlusJakartaSans_800ExtraBold",
                  fontSize: 14,
                  color: G.charcoal,
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  fontFamily: "PlusJakartaSans_500Medium",
                  fontSize: 12,
                  color: G.muted,
                  marginTop: 4,
                }}
              >
                {subtitle}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

function Section({ title }: { title: string }) {
  return (
    <Text
      style={{
        fontFamily: "PlusJakartaSans_800ExtraBold",
        fontSize: 11,
        color: G.muted,
        textTransform: "uppercase",
        letterSpacing: 1.3,
        marginTop: 18,
        marginBottom: 6,
      }}
    >
      {title}
    </Text>
  );
}

function Row({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: G.border,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          backgroundColor: G.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>

      <View>
        <Text
          style={{
            fontFamily: "PlusJakartaSans_700Bold",
            fontSize: 14,
            color: G.charcoal,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "PlusJakartaSans_500Medium",
            fontSize: 12,
            color: G.muted,
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
