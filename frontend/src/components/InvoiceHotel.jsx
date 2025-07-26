import React from "react";

const InvoiceHotel = ({ invoice }) => {
    if (!invoice) return null;

    const {
        guest_name,
        room_number,
        check_in,
        check_out,
        service = [],
        additional_fee = 0,
        total = 0,
    } = invoice;

    const formatDate = (date) => date?.replace("T", " ").slice(0, 16);

    return (
        <div id="invoice-to-print" style={styles.wrapper}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h2 style={{ margin: 0 }}>🏨 HOTEL RANS</h2>
                    <p style={styles.address}>Jl. Raya Damai No.88, Bandung</p>
                    <p style={styles.address}>+62 812-3456-7890</p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <h3 style={{ margin: 0 }}>INVOICE</h3>
                    <p style={{ margin: 0, fontSize: 13 }}>Tanggal: {formatDate(new Date().toISOString())}</p>
                </div>
            </div>

            {/* Guest Info */}
            <div style={styles.infoSection}>
                <div style={{ ...styles.infoBlock, textAlign: "left" }}>
                    <p><strong>Guest Name:</strong> {guest_name}</p>
                    <p><strong>Room Number:</strong> {room_number}</p>
                </div>
                <div style={{ ...styles.infoBlock, textAlign: "right" }}>
                    <p><strong>Check-in:</strong> {formatDate(check_in)}</p>
                    <p><strong>Check-out:</strong> {formatDate(check_out)}</p>
                </div>
            </div>

            {/* Services Table */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Keterangan</th>
                        <th style={styles.th}>Jumlah</th>
                        <th style={styles.th}>Harga (Rp)</th>
                        <th style={styles.th}>Total (Rp)</th>
                    </tr>
                </thead>
                <tbody>
                    {service.map((item, idx) => (
                        <tr key={idx}>
                            <td style={styles.td}>{item.name}</td>
                            <td style={styles.td}>{item.qty}</td>
                            <td style={styles.td}>Rp{item.price.toLocaleString("id-ID")}</td>
                            <td style={styles.td}>Rp{item.total.toLocaleString("id-ID")}</td>
                        </tr>
                    ))}
                    {additional_fee > 0 && (
                        <tr>
                            <td style={styles.td} colSpan={3}><strong>Layanan Tambahan</strong></td>
                            <td style={styles.td}>Rp{additional_fee.toLocaleString("id-ID")}</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Total */}
            <div style={styles.totalContainer}>
                <div style={styles.totalBox}>
                    <p><strong>Subtotal:</strong> Rp{(total - additional_fee).toLocaleString("id-ID")}</p>
                    <p><strong>Layanan Tambahan:</strong> Rp{additional_fee.toLocaleString("id-ID")}</p>
                    <hr />
                    <h3>Total Tagihan: Rp{total.toLocaleString("id-ID")}</h3>
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <p>💖 Terima kasih telah menginap di HOTEL RANS</p>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        fontSize: "14px",
        color: "#000",
        maxWidth: "700px",
        margin: "0 auto",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "2px solid #000",
        paddingBottom: "10px",
        marginBottom: "20px",
    },
    address: {
        margin: 0,
        fontSize: "13px",
        color: "#555"
    },
    infoSection: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
    },
    infoBlock: {
        width: "48%",
        lineHeight: "1.6",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "10px",
        marginBottom: "30px",
    },
    th: {
        border: "1px solid #000",
        padding: "10px",
        backgroundColor: "#f8f8f8",
        textAlign: "left",
    },
    td: {
        border: "1px solid #ccc",
        padding: "10px",
        verticalAlign: "top",
    },
    totalContainer: {
        display: "flex",
        justifyContent: "flex-end",
    },
    totalBox: {
        textAlign: "right",
        width: "300px",
        lineHeight: "1.8",
    },
    footer: {
        textAlign: "center",
        marginTop: "40px",
        fontStyle: "italic",
        fontSize: "13px",
        color: "#555",
    }
};

export default InvoiceHotel;
