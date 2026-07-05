import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

const NAVY = "#0f2742"
const ACCENT = "#ff7a1a"
const MUTED = "#5b6b7b"
const LINE = "#e3e9f0"

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#1c2733" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  orgName: { fontSize: 16, fontWeight: 700, color: NAVY },
  devisNumber: { fontSize: 14, fontWeight: 700, color: NAVY, textAlign: "right" },
  muted: { color: MUTED },
  section: { marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  tableHeader: {
    flexDirection: "row",
    borderBottom: `1px solid ${NAVY}`,
    paddingBottom: 6,
    marginBottom: 6,
    color: NAVY,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1px solid ${LINE}`,
    paddingVertical: 6,
  },
  colDescription: { width: "45%" },
  colQty: { width: "15%", textAlign: "right" },
  colUnitPrice: { width: "20%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  totals: { marginTop: 12, alignItems: "flex-end" },
  totalTtc: { fontSize: 13, fontWeight: 700, color: NAVY, marginTop: 4 },
  accentBar: { height: 4, backgroundColor: ACCENT, marginBottom: 20 },
  footer: { marginTop: 24, fontSize: 9, color: MUTED },
})

type DevisPdfProps = {
  orgName: string
  number: string
  status: string
  issuedDate: string
  validUntil: string | null
  clientName: string
  chantierName: string | null
  lines: { description: string; quantity: number; unit: string | null; unitPrice: number; total: number }[]
  amountHt: number
  tvaRate: number
  amountTtc: number
  notes: string | null
}

export function DevisDocument(props: DevisPdfProps) {
  return (
    <Document title={`Devis ${props.number}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />
        <View style={styles.header}>
          <Text style={styles.orgName}>{props.orgName}</Text>
          <View>
            <Text style={styles.devisNumber}>DEVIS {props.number}</Text>
            <Text style={styles.muted}>Émis le {props.issuedDate}</Text>
            {props.validUntil && <Text style={styles.muted}>Valable jusqu&apos;au {props.validUntil}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 700 }}>Client : {props.clientName}</Text>
          {props.chantierName && <Text style={styles.muted}>Chantier : {props.chantierName}</Text>}
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colDescription}>Description</Text>
          <Text style={styles.colQty}>Qté</Text>
          <Text style={styles.colUnitPrice}>Prix unitaire</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>
        {props.lines.map((line, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colDescription}>{line.description}</Text>
            <Text style={styles.colQty}>
              {line.quantity}
              {line.unit ? ` ${line.unit}` : ""}
            </Text>
            <Text style={styles.colUnitPrice}>{line.unitPrice.toFixed(2)} €</Text>
            <Text style={styles.colTotal}>{line.total.toFixed(2)} €</Text>
          </View>
        ))}

        <View style={styles.totals}>
          <Text style={styles.muted}>Total HT : {props.amountHt.toFixed(2)} €</Text>
          <Text style={styles.muted}>TVA ({props.tvaRate}%)</Text>
          <Text style={styles.totalTtc}>Total TTC : {props.amountTtc.toFixed(2)} €</Text>
        </View>

        {props.notes && (
          <View style={styles.section}>
            <Text style={styles.muted}>{props.notes}</Text>
          </View>
        )}

        <Text style={styles.footer}>Devis généré via Pilotage BTP.</Text>
      </Page>
    </Document>
  )
}
