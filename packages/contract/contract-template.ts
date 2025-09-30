export const CONTRACT_TEMPLATE = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hợp đồng thuê xe điện</title>
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
        <div class="title">HỢP ĐỒNG THUÊ XE ĐIỆN</div>
        <div class="subtitle">Electric Vehicle Rental Contract</div>
    </div>

    <div class="section">
        <div class="section-title">THÔNG TIN CÁC BÊN</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Bên cho thuê:</span>
                <span class="info-value">Công ty TNHH EV Station</span>
            </div>
            <div class="info-item">
                <span class="info-label">Địa chỉ:</span>
                <span class="info-value">123 Đường ABC, Quận 1, TP.HCM</span>
            </div>
            <div class="info-item">
                <span class="info-label">Bên thuê:</span>
                <span class="info-value">[RENTER_NAME]</span>
            </div>
            <div class="info-item">
                <span class="info-label">CCCD/CMND:</span>
                <span class="info-value">[RENTER_ID]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Số điện thoại:</span>
                <span class="info-value">[RENTER_PHONE]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">[RENTER_EMAIL]</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">THÔNG TIN XE THUÊ</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Biển số xe:</span>
                <span class="info-value">[LICENSE_PLATE]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Model xe:</span>
                <span class="info-value">[VEHICLE_MODEL]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Dung lượng pin:</span>
                <span class="info-value">[BATTERY_CAPACITY] kWh</span>
            </div>
            <div class="info-item">
                <span class="info-label">Số km hiện tại:</span>
                <span class="info-value">[CURRENT_ODO] km</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">THÔNG TIN THUÊ</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Ngày bắt đầu:</span>
                <span class="info-value">[START_DATE]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Ngày kết thúc:</span>
                <span class="info-value">[END_DATE]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Địa điểm nhận xe:</span>
                <span class="info-value">[PICKUP_LOCATION]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Địa điểm trả xe:</span>
                <span class="info-value">[RETURN_LOCATION]</span>
            </div>
            <div class="info-item">
                <span class="info-label">Tổng tiền thuê:</span>
                <span class="info-value">[TOTAL_PRICE] VNĐ</span>
            </div>
            
        </div>
    </div>

    <div class="section">
        <div class="section-title">ĐIỀU KHOẢN VÀ ĐIỀU KIỆN</div>
        <div class="terms">
            <p><strong>Điều 1:</strong> Bên thuê cam kết sử dụng xe đúng mục đích, tuân thủ luật giao thông và các quy định của pháp luật.</p>
            <p><strong>Điều 2:</strong> Bên thuê có trách nhiệm bảo quản xe, không được cho người khác thuê lại hoặc sử dụng vào mục đích trái pháp luật.</p>
            <p><strong>Điều 3:</strong> Trong trường hợp xe bị hư hỏng do lỗi của bên thuê, bên thuê phải chịu chi phí sửa chữa.</p>
            <p><strong>Điều 4:</strong> Bên thuê phải trả xe đúng thời gian quy định. Nếu trả muộn sẽ bị phạt theo quy định.</p>
            <p><strong>Điều 5:</strong> Hợp đồng này có hiệu lực từ ngày ký và chấm dứt khi bên thuê trả xe và thanh toán đầy đủ.</p>
            <p><strong>Điều 6 (Đặt cọc):</strong> Bên thuê đặt cọc một khoản tiền để đảm bảo thực hiện hợp đồng. Khoản đặt cọc sẽ được hoàn trả khi bên thuê hoàn tất nghĩa vụ và không phát sinh vi phạm, hư hỏng.</p>
            <p><strong>Điều 7 (Bảo hiểm & tai nạn):</strong> Xe được mua bảo hiểm theo quy định. Trường hợp xảy ra tai nạn, các bên phối hợp làm việc với cơ quan chức năng và đơn vị bảo hiểm. Mọi chi phí ngoài phạm vi bảo hiểm do bên gây ra lỗi chịu trách nhiệm.</p>
            <p><strong>Điều 8 (Kiểm tra định kỳ):</strong> Bên cho thuê có quyền kiểm tra xe định kỳ trong thời hạn thuê với thông báo trước hợp lý cho bên thuê.</p>
            <p><strong>Điều 9 (Mất giấy tờ xe):</strong> Nếu bên thuê làm mất giấy tờ xe, bên thuê chịu chi phí cấp lại và mọi tổn thất phát sinh liên quan.</p>
            <p><strong>Điều 10 (Giải quyết tranh chấp):</strong> Tranh chấp phát sinh được ưu tiên giải quyết thông qua thương lượng. Nếu không đạt thỏa thuận, tranh chấp sẽ được giải quyết tại Tòa án/Trọng tài có thẩm quyền.</p>
            <p><strong>Điều 11 (Hiệu lực & lưu giữ):</strong> Hợp đồng có hiệu lực kể từ ngày tạo/hoặc kể từ khi cả hai bên ký (tùy quy định nội bộ). Hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.</p>
        </div>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-placeholder">Chữ ký bên thuê</div>
            <div class="signature-image" id="renter-signature">
                <<SIGN_RENTER>>
            </div>
            <div class="signature-placeholder">[RENTER_NAME]</div>
            <div class="signature-placeholder">Ngày: [SIGN_DATE_RENTER]</div>
        </div>
        <div class="signature-box">
            <div class="signature-placeholder">Chữ ký bên cho thuê</div>
            <div class="signature-image" id="staff-signature">
                <<SIGN_STAFF>>
            </div>
            <div class="signature-placeholder">Nhân viên: [STAFF_NAME]</div>
            <div class="signature-placeholder">Ngày: [SIGN_DATE_STAFF]</div>
        </div>
    </div>

    <div class="contract-id">
        <p>Mã hợp đồng: [CONTRACT_ID]</p>
        <p>Ngày tạo: [CONTRACT_CREATED_DATE]</p>
    </div>
</body>
</html>`;
