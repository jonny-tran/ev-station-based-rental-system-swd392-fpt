export const CONTRACT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electric Vehicle Rental Contract</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 18px;
            color: #666;
        }
        .section {
            margin: 20px 0;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 15px 0;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dotted #ccc;
        }
        .info-label {
            font-weight: bold;
            min-width: 150px;
        }
        .info-value {
            flex: 1;
            text-align: right;
        }
        .terms {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #007bff;
        }
        .signature-section {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }
        .signature-box {
            text-align: center;
            border: 2px solid #333;
            padding: 20px;
            min-height: 120px;
            position: relative;
        }
        .signature-placeholder {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
        }
        .signature-image {
            max-width: 100%;
            max-height: 80px;
            margin: 10px 0;
        }
        .contract-id {
            text-align: right;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
        }
        .date {
            text-align: right;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">ELECTRIC VEHICLE RENTAL CONTRACT</div>
        <div class="subtitle">Electric Vehicle Rental Agreement</div>
    </div>

    <div class="section">
        <div class="section-title">PARTY INFORMATION</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Lessor:</span>
                <span class="info-value">EV Station Co., Ltd.</span>
            </div>
            <div class="info-item">
                <span class="info-label">Address:</span>
                <span class="info-value">123 ABC Street, District 1, Ho Chi Minh City</span>
            </div>
            <div class="info-item">
                <span class="info-label">Lessee:</span>
                <span class="info-value">[RENTER_NAME]</span>
            </div>
            <div class="info-item">
                <span class="info-label">ID Number:</span>
                <span class="info-value">[RENTER_ID]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Phone Number:</span>
                <span class="info-value">[RENTER_PHONE]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">[RENTER_EMAIL]</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">VEHICLE INFORMATION</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">License Plate:</span>
                <span class="info-value">[LICENSE_PLATE]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Vehicle Model:</span>
                <span class="info-value">[VEHICLE_MODEL]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Battery Capacity:</span>
                <span class="info-value">[BATTERY_CAPACITY] kWh</span>
            </div>
            <div class="info-item">
                <span class="info-label">Current Odometer:</span>
                <span class="info-value">[CURRENT_ODO] km</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">RENTAL INFORMATION</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Start Date:</span>
                <span class="info-value">[START_DATE]</span>
            </div>
            <div class="info-item">
                <span class="info-label">End Date:</span>
                <span class="info-value">[END_DATE]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Pickup Location:</span>
                <span class="info-value">[PICKUP_LOCATION]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Return Location:</span>
                <span class="info-value">[RETURN_LOCATION]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Total Rental Fee:</span>
                <span class="info-value">[TOTAL_PRICE] VND</span>
            </div>
            
        </div>
    </div>

    <div class="section">
        <div class="section-title">TERMS AND CONDITIONS</div>
        <div class="terms">
            <p><strong>Article 1:</strong> The lessee commits to using the vehicle for proper purposes, complying with traffic laws and legal regulations.</p>
            <p><strong>Article 2:</strong> The lessee is responsible for maintaining the vehicle and shall not sublease it to others or use it for illegal purposes.</p>
            <p><strong>Article 3:</strong> In case of vehicle damage due to the lessee's fault, the lessee must bear the repair costs.</p>
            <p><strong>Article 4:</strong> The lessee must return the vehicle on time as specified. Late returns will incur penalties as regulated.</p>
            <p><strong>Article 5:</strong> This contract is effective from the signing date and terminates when the lessee returns the vehicle and makes full payment.</p>
            <p><strong>Article 6 (Deposit):</strong> The lessee deposits an amount to guarantee contract performance. The deposit will be refunded when the lessee completes obligations without violations or damages.</p>
            <p><strong>Article 7 (Insurance & Accidents):</strong> The vehicle is insured as required by law. In case of accidents, parties shall cooperate with authorities and insurance companies. Any costs beyond insurance coverage shall be borne by the party at fault.</p>
            <p><strong>Article 8 (Periodic Inspection):</strong> The lessor has the right to inspect the vehicle periodically during the rental period with reasonable notice to the lessee.</p>
            <p><strong>Article 9 (Lost Vehicle Documents):</strong> If the lessee loses vehicle documents, the lessee shall bear the cost of reissuance and any related losses.</p>
            <p><strong>Article 10 (Dispute Resolution):</strong> Arising disputes shall be resolved through negotiation first. If no agreement is reached, disputes will be resolved at competent courts/arbitration.</p>
            <p><strong>Article 11 (Validity & Retention):</strong> The contract is effective from the creation date/or from when both parties sign (according to internal regulations). The contract is made in 02 copies with equal legal value, each party keeps 01 copy.</p>
        </div>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-placeholder">Lessee Signature</div>
            <div class="signature-image" id="renter-signature">
                <<SIGN_RENTER>>
            </div>
            <div class="signature-placeholder">[RENTER_NAME]</div>
            <div class="signature-placeholder">Date: [SIGN_DATE_RENTER]</div>
        </div>
        <div class="signature-box">
            <div class="signature-placeholder">Lessor Signature</div>
            <div class="signature-image" id="staff-signature">
                <<SIGN_STAFF>>
            </div>
            <div class="signature-placeholder">Staff: [STAFF_NAME]</div>
            <div class="signature-placeholder">Date: [SIGN_DATE_STAFF]</div>
        </div>
    </div>

    <div class="contract-id">
        <p>Contract ID: [CONTRACT_ID]</p>
        <p>Created Date: [CONTRACT_CREATED_DATE]</p>
    </div>
</body>
</html>`;
