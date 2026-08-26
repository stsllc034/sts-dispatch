import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  Svg,
  Path,
  Circle,
  Rect,
  StyleSheet,
} from "@react-pdf/renderer";

type Props = {
  trip: any;
};

const BLUE = "#173B82";
const LIGHT_BLUE = "#EAF0FA";
const BORDER = "#C7D0DD";

const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#111827",
  },

  header: {
    backgroundColor: BLUE,
    padding: 12,
    paddingLeft: 16,
    paddingRight: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: {
    flex: 1,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },

  headerSubtitle: {
    color: "#FFFFFF",
    fontSize: 9.5,
  },

  logo: {
    width: 78,
    height: 52,
    objectFit: "contain",
    backgroundColor: "#FFFFFF",
  },

  grid: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 5,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
  },

  cell: {
    width: "33.333%",
    minHeight: 66,
    padding: 9,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  lastCell: {
    width: "33.333%",
    minHeight: 66,
    padding: 9,
    borderBottomWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconBox: {
    width: 22,
    height: 22,
    marginRight: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  cellText: {
    flex: 1,
  },

  label: {
    color: BLUE,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },

  value: {
    color: "#111827",
    fontSize: 9.5,
    lineHeight: 1.35,
  },

  bottomRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 16,
  },

  passengerCell: {
    width: "33.333%",
    minHeight: 58,
    padding: 9,
    borderRightWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  detailsCell: {
    width: "66.667%",
    minHeight: 58,
    padding: 9,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  verification: {
    backgroundColor: LIGHT_BLUE,
    borderWidth: 1,
    borderColor: "#9CC5FF",
    borderRadius: 7,
    padding: 12,
    marginBottom: 12,
  },

  verificationTitle: {
    color: BLUE,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },

  verificationText: {
    color: "#173B82",
    fontSize: 8.5,
    lineHeight: 1.45,
    marginBottom: 7,
  },

  verifyButton: {
    backgroundColor: BLUE,
    color: "#FFFFFF",
    textAlign: "center",
    padding: 9,
    borderRadius: 4,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginTop: 8,
  },

  footer: {
    textAlign: "center",
    marginTop: 3,
    color: "#173B82",
  },

  footerName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },

  footerText: {
    fontSize: 8,
  },

  important: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },

  importantTitle: {
    color: BLUE,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 7,
  },

  importantRow: {
    flexDirection: "row",
  },

  importantMessage: {
    width: "65%",
    paddingRight: 12,
  },

  importantContact: {
    width: "35%",
    paddingLeft: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  importantText: {
    fontSize: 8,
    lineHeight: 1.35,
  },

  importantName: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
});

function display(value: any) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

function formatDate(value: any) {
  if (!value) {
    return "-";
  }

  const datePart = String(value).split("T")[0];
  const parts = datePart.split("-");

  if (parts.length === 3) {
    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  }

  return String(value);
}

function Icon({
  type,
}: {
  type:
    | "calendar"
    | "people"
    | "building"
    | "person"
    | "phone"
    | "location"
    | "arrival"
    | "departure"
    | "flag"
    | "event"
    | "return"
    | "meal";
}) {
  return (
    <View style={styles.iconBox}>
      <Svg width="21" height="21" viewBox="0 0 24 24">
        {type === "calendar" && (
          <>
            <Rect
              x="3"
              y="5"
              width="18"
              height="16"
              rx="2"
              fill="none"
              stroke={BLUE}
              strokeWidth="2"
            />
            <Path
              d="M7 3v4M17 3v4M3 10h18"
              stroke={BLUE}
              strokeWidth="2"
            />
            <Path
              d="M7 14h2M11 14h2M15 14h2M7 18h2M11 18h2"
              stroke={BLUE}
              strokeWidth="1.5"
            />
          </>
        )}

        {type === "people" && (
          <>
            <Circle cx="12" cy="7" r="3" fill={BLUE} />
            <Circle cx="5.5" cy="9" r="2" fill={BLUE} />
            <Circle cx="18.5" cy="9" r="2" fill={BLUE} />
            <Path
              d="M6 20c0-4 2.3-6 6-6s6 2 6 6"
              fill={BLUE}
            />
          </>
        )}

        {type === "building" && (
          <>
            <Path
              d="M5 21V4h14v17M3 21h18"
              fill="none"
              stroke={BLUE}
              strokeWidth="2"
            />
            <Path
              d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"
              stroke={BLUE}
              strokeWidth="2"
            />
          </>
        )}

        {type === "person" && (
          <>
            <Circle cx="12" cy="7" r="3.5" fill={BLUE} />
            <Path
              d="M5 21c.4-5 2.7-7.5 7-7.5s6.6 2.5 7 7.5"
              fill={BLUE}
            />
          </>
        )}

        {type === "phone" && (
          <Path
            d="M7 3l3 4-2 2c1.2 2.4 3.2 4.4 5.6 5.6l2-2 4 3c.6.5.7 1.4.2 2.1l-1.2 1.6c-.6.8-1.7 1.1-2.6.7C9.2 17.6 6.4 14.8 4 8c-.4-.9-.1-2 .7-2.6L6.3 4.2C7 3.7 7.9 3.4 8.5 4L7 3z"
            fill={BLUE}
          />
        )}

        {type === "location" && (
          <>
            <Path
              d="M12 21s7-6.3 7-12A7 7 0 1 0 5 9c0 5.7 7 12 7 12z"
              fill={BLUE}
            />
            <Circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
          </>
        )}

        {type === "arrival" && (
          <>
            <Circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke={BLUE}
              strokeWidth="2"
            />
            <Path
              d="M12 7v5l3 2"
              stroke={BLUE}
              strokeWidth="2"
            />
          </>
        )}

        {type === "departure" && (
          <Path
            d="M4 12h14M13 7l5 5-5 5"
            fill="none"
            stroke={BLUE}
            strokeWidth="2.2"
          />
        )}

        {type === "flag" && (
          <>
            <Path
              d="M6 21V3"
              stroke={BLUE}
              strokeWidth="2"
            />
            <Path
              d="M7 4c4-3 6 2 11-1v8c-5 3-7-2-11 1V4z"
              fill={BLUE}
            />
          </>
        )}

        {type === "event" && (
          <>
            <Circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke={BLUE}
              strokeWidth="2"
            />
            <Path
              d="M12 7v5l3 2"
              stroke={BLUE}
              strokeWidth="2"
            />
          </>
        )}

        {type === "return" && (
          <Path
            d="M20 12H6m5-5-5 5 5 5"
            fill="none"
            stroke={BLUE}
            strokeWidth="2.2"
          />
        )}

        {type === "meal" && (
          <>
            <Path
              d="M7 3v8M4 3v5c0 2 1 3 3 3M10 3v5"
              stroke={BLUE}
              strokeWidth="1.8"
              fill="none"
            />
            <Path
              d="M7 11v10"
              stroke={BLUE}
              strokeWidth="1.8"
            />
            <Path
              d="M17 3v18M17 3c3 2 3 5 0 7"
              stroke={BLUE}
              strokeWidth="1.8"
              fill="none"
            />
          </>
        )}
      </Svg>
    </View>
  );
}

function Cell({
  icon,
  label,
  value,
  last = false,
}: {
  icon:
    | "calendar"
    | "people"
    | "building"
    | "person"
    | "phone"
    | "location"
    | "arrival"
    | "departure"
    | "flag"
    | "event"
    | "return"
    | "meal";
  label: string;
  value: any;
  last?: boolean;
}) {
  return (
    <View style={last ? styles.lastCell : styles.cell}>
      <Icon type={icon} />

      <View style={styles.cellText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{display(value)}</Text>
      </View>
    </View>
  );
}

export default function TripConfirmationPDF({ trip }: Props) {
  const charterParty =
    trip.charterParty?.companyName ||
    trip.charterParty?.name ||
    "-";

  const destinationArrivalTime =
    trip.destinationArrivalTime ||
    trip.destinationArrivalTime ||
    "-";

const customerVerificationUrl =
  `http://localhost:3000/travel/${trip.id}/verify`;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              STS Trip Confirmation
            </Text>

            <Text style={styles.headerSubtitle}>
              Please review your trip details
            </Text>
          </View>

          <Image
            src="/images/sts-logo.png"
            style={styles.logo}
          />
        </View>

        {/* MAIN TRIP GRID */}
        <View style={styles.grid}>

          <View style={styles.row}>
            <Cell
              icon="calendar"
              label="TRIP NUMBER"
              value={trip.tripNumber || trip.tripId}
            />

            <Cell
              icon="calendar"
              label="TRIP DATE"
              value={formatDate(trip.tripDate)}
            />

            <Cell
              icon="people"
              label="TRIP TYPE"
              value={trip.tripType}
              last
            />
          </View>

          <View style={styles.row}>
            <Cell
              icon="building"
              label="CHARTER PARTY"
              value={charterParty}
            />

            <Cell
              icon="person"
              label="CONTACT NAME"
              value={trip.contactName}
            />

            <Cell
              icon="phone"
              label="CONTACT PHONE"
              value={trip.contactPhone}
              last
            />
          </View>

          <View style={styles.row}>
            <Cell
              icon="location"
              label="PICKUP LOCATION"
              value={trip.pickupLocation}
            />

            <Cell
              icon="arrival"
              label="ARRIVAL TIME"
              value={trip.arrivalTime}
            />

            <Cell
              icon="departure"
              label="DEPARTURE TIME"
              value={trip.departureTime}
              last
            />
          </View>

          <View style={styles.row}>
            <Cell
              icon="flag"
              label="DESTINATION"
              value={trip.destination}
            />

            <Cell
              icon="event"
              label="EVENT TIME"
              value={trip.eventTime}
            />

            <Cell
              icon="arrival"
              label="DESTINATION ARRIVAL TIME"
              value={destinationArrivalTime}
              last
            />
          </View>

          <View style={styles.row}>
            <Cell
              icon="departure"
              label="DEPART DESTINATION TIME"
              value={trip.departDestinationTime}
            />

            <Cell
              icon="return"
              label="RETURN TIME"
              value={trip.returnToSchoolTime}
            />

            <Cell
              icon="meal"
              label="MEAL STOP"
              value={trip.mealStop ? "Yes" : "No"}
              last
            />
          </View>

        </View>

        {/* PASSENGER COUNT / TRIP DETAILS */}
        <View style={styles.bottomRow}>
          <View style={styles.passengerCell}>
            <Icon type="people" />

            <View style={styles.cellText}>
              <Text style={styles.label}>
                PASSENGER COUNT
              </Text>

              <Text style={styles.value}>
                {display(trip.passengerCount)}
              </Text>
            </View>
          </View>

          <View style={styles.detailsCell}>
            <View style={styles.iconBox}>
              <Svg width="21" height="21" viewBox="0 0 24 24">
                <Rect
                  x="5"
                  y="3"
                  width="14"
                  height="18"
                  rx="1"
                  fill="none"
                  stroke={BLUE}
                  strokeWidth="2"
                />
                <Path
                  d="M8 8h8M8 12h8M8 16h5"
                  stroke={BLUE}
                  strokeWidth="1.5"
                />
              </Svg>
            </View>

            <View style={styles.cellText}>
              <Text style={styles.label}>
                TRIP DETAILS
              </Text>

              <Text style={styles.value}>
                {trip.tripDetails ||
                  "No trip details provided."}
              </Text>
            </View>
          </View>
        </View>

        {/* CUSTOMER VERIFICATION */}
        <View style={styles.verification}>
          <Text style={styles.verificationTitle}>
            Customer Verification
          </Text>

          <Text style={styles.verificationText}>
            Please review all of the trip information above.
            If everything is correct, click the button below
            to verify the trip details.
          </Text>

          <Text style={styles.verificationText}>
            If any changes are needed, please contact Stephens
            Transportation Services before the trip.
          </Text>

          <Link src={customerVerificationUrl}>
            <Text style={styles.verifyButton}>
              VERIFY DETAILS
            </Text>
          </Link>
        </View>

        {/* STS CONTACT */}
        <View style={styles.footer}>
          <Text style={styles.footerName}>
            Stephens Transportation Services
          </Text>

          <Text style={styles.footerText}>
            Daniel Stephens • (951) 557-1108
          </Text>

          <Text style={styles.footerText}>
            stsllc034@gmail.com
          </Text>
        </View>

        {/* IMPORTANT */}
        <View style={styles.important}>
          <Text style={styles.importantTitle}>
            IMPORTANT
          </Text>

          <View style={styles.importantRow}>

            <View style={styles.importantMessage}>
              <Text style={styles.importantText}>
                If any changes are needed, please contact
                Daniel Stephens immediately.
              </Text>
            </View>

            <View style={styles.importantContact}>
              <Svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                style={{ marginRight: 6 }}
              >
                <Path
                  d="M4 13a8 8 0 0 1 16 0v3"
                  fill="none"
                  stroke={BLUE}
                  strokeWidth="2"
                />

                <Path
                  d="M4 13v5H3a2 2 0 0 1-2-2v-3h3Z"
                  fill="none"
                  stroke={BLUE}
                  strokeWidth="2"
                />

                <Path
                  d="M20 13v5h1a2 2 0 0 0 2-2v-3h-3Z"
                  fill="none"
                  stroke={BLUE}
                  strokeWidth="2"
                />

                <Path
                  d="M20 18c0 2-2 3-5 3"
                  fill="none"
                  stroke={BLUE}
                  strokeWidth="2"
                />
              </Svg>

              <View>
                <Text style={styles.importantName}>
                  Daniel Stephens
                </Text>

                <Text style={styles.importantText}>
                  (951) 557-1108
                </Text>

                <Text style={styles.importantText}>
                  stsllc034@gmail.com
                </Text>
              </View>
            </View>

          </View>
        </View>

      </Page>
    </Document>
  );
}