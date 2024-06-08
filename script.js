// Thêm sự kiện khi form được submit
document.getElementById("analysis-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form (tải lại trang)

    // Lấy giá trị URL từ input
    var urlInput = document.getElementById("url-input").value;

    // Validate URL
    if (!isValidUrl(urlInput)) {
        displayMessage("URL không hợp lệ. Vui lòng nhập lại.");
        return;
    }

    // Gửi URL đến backend để phân tích
    analyzeUrl(urlInput);
});

// Hàm kiểm tra URL hợp lệ
function isValidUrl(url) {
    /* Sử dụng biểu thức chính quy (regex) để kiểm tra xem URL có hợp lệ hay 
    không. Regex kiểm tra định dạng của URL bao gồm giao thức, tên miền, địa chỉ
     IP, cổng, đường dẫn, query string và fragment.*/
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
}

// Hàm gửi URL để phân tích
function analyzeUrl(url) {
    var xhr = new XMLHttpRequest(); //Tạo một đối tượng XMLHttpRequest để gửi yêu cầu.
    xhr.open("POST", "http://localhost:8080/api/analyze", true); //Mở một kết nối đến endpoint /analyze-url với phương thức POST.
    xhr.setRequestHeader("Content-Type", "application/json"); //Đặt header cho yêu cầu là JSON.

    // Xử lý phản hồi từ server
    xhr.onreadystatechange = function() { //Định nghĩa một hàm để xử lý phản hồi từ server.
        if (xhr.readyState === 4) { //Kiểm tra xem yêu cầu đã hoàn thành chưa.
            if (xhr.status === 200) { //Nếu phản hồi từ server là 200 (OK), parse JSON và hiển thị kết quả phân tích.
                var response = xhr.responseText;
                displayAnalysisResult(response);
            } else {
                displayMessage("Có lỗi xảy ra khi phân tích URL. Vui lòng thử lại.");
            }
        }
    };

    xhr.send(JSON.stringify(url)); //Gửi dữ liệu URL đến server dưới dạng JSON.
}

// Hàm hiển thị kết quả phân tích

function displayAnalysisResult(result) {
    var resultDiv = document.getElementById("analysis-results");
    resultDiv.innerHTML = "<p>Kết quả phân tích: " + result + "</p>";
}

// Hàm hiển thị thông báo
function displayMessage(message) {
    var resultDiv = document.getElementById("analysis-results");
    resultDiv.innerHTML = "<p>" + message + "</p>";
}