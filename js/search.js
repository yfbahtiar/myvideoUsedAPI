const apiSrv = window.location.origin + '/myvideo/api/index.php';
const elemHariTanggal = document.getElementById('hariTanggal');
const changeToggleSidebar = document.getElementById('accordionSidebar');

// get varible di url alias $_GET
function getUrlVars(param = null) {
    if (param !== null) {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars[param];
    } else {
        return null;
    }
}
// console.log(getUrlVars('q')); lalu arahkan sesuai kondisi
const q = getUrlVars('q');
// jika q = '' || q = undefined 
// jika q ada lalu resp 404 or 200
(q == undefined) ? pencarianPage() : resultPage(q);

// buat fungsi yang menampilkan Hari, tg Bulan thun in indo
function month($month, $format = "mmmm") {
    if ($format == "mmmm") {
        $fm = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    } else if ($format == "mmm") {
        $fm = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    }

    return $fm[$month];
}

// fungsi tammpil hari indo
function day($day, $format = "dddd") {
    if ($format == "dddd") {
        $fd = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    } else if ($format == "ddd") {
        $fd = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    }

    return $fd[$day];
}

// cetak harl, tanggal bulan tahun sekarang indo
function dateNowIndo() {
    let tanggal = new Date().getDate();
    let hari = new Date().getDay();
    let bulan = new Date().getMonth();
    let tahun = new Date().getFullYear();

    return day(hari, 'dddd') + ', ' + tanggal + ' ' + month(bulan, 'mmmm') + ' ' + tahun;
}

// tamplkan tgl sekarang
elemHariTanggal.innerHTML = dateNowIndo();

// buat fungsi hilangkan toggled ketika nav item in focus
function navItemBlur() {
    changeToggleSidebar.classList.add('toggled');
}

// buat fungsi tambahakan toggled ketika nav item in blur
function navItemFocus() {
    changeToggleSidebar.classList.remove('toggled');
}

function pencarianPage() {
    // alert('tampilkan keyboard');
    // listen input from keyboard
    Keyboard.init();
    document.querySelector(".use-keyboard-input").focus();
    $(document).on('click', '.keyboard__key', () => {
        let q = Keyboard.properties.value;
        if (q.length > 3) {
            $.ajax({
                url: apiSrv,
                type: 'get',
                data: {
                    page: 'getData',
                    q: q
                },
                success: function (resp) {
                    let respData = JSON.parse(resp);
                    // console.log(respData);
                    if (respData['status'] == 404) {
                        $('#resultSearch').html(`            
                        <div class="alert alert-info mb-3 text-center" role="alert">
                            <i class="fas fa-exclamation-circle fa-fw fa-2x"></i>
                            <p class="mb-0">Tidak ada data video tersedia</p>
                        </div>
                        `);
                    }
                    else if (respData['status'] == 200) {
                        let replaceElement = `<h1 class="h6 mb-4 text-gray-500">"${q}"</h1><div class="slider-result">`;
                        for (let i = 0; i < respData.data.length; i++) {
                            replaceElement += `
                            <a href="video.html?v=${respData['data'][i]['id_video']}" class="text-decoration-none text-white nav-video">
                                <div class="card bg-transparent text-white mx-3">
                                    <div class="card-body">
                                        ${respData['data'][i]['judul']}
                                        <p class="border-top text-center mb-0 mt-1 font-weight-lighter">
                                        <i class="fas fa-folder-open"></i> ${respData['data'][i]['kategori']}
                                        </p>
                                    </div>
                                </div>
                            </a>`;
                        }
                        replaceElement += '</div>';
                        $('#resultSearch').html(replaceElement);
                        sliderResult();
                    }
                },
                error: function () {
                    $('#resultSearch').html(`<div div class="alert alert-warning mb-3 text-center" role = "alert" id = "ajaxLoadError" ><i class="fas fa-exclamation-triangle fa-fw fa-2x"></i><p class="my-3">Error, terjadi kesalaan saat memuat data</p><a href="${window.location.href}" class="btn tbn-sm btn-outline-dark">Reload</a></div>`);
                }
            });
        } else if (q.length < 3) {
            $('#resultSearch').html(`<div class="text-center"><p><strong>${3 - q.length}</strong> karakter lagi untuk pencarian</p></div>`);
        }
    });
}

function resultPage(q) {
    // alert(`pencarian ${q}`);
    // listen q yg ada di url ke ajax
    $('#mainId').html(`<div class="text-center"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>`);
    $.ajax({
        url: apiSrv,
        type: 'get',
        data: {
            page: 'getData',
            q: decodeURI(q)
        },
        success: function (resp) {
            let respData = JSON.parse(resp);
            // console.log(respData);
            if (respData['status'] == 404) {
                $('#mainId').html(`            
                        <div class="alert alert-info mb-3 text-center" role="alert">
                            <i class="fas fa-exclamation-circle fa-fw fa-2x"></i>
                            <p class="mb-0">Tidak ada data video tersedia</p>
                        </div>
                        `);
            }
            else if (respData['status'] == 200) {
                let replaceElement = `<h1 class="h6 mb-4 text-gray-500">"${q}"</h1><div class="slider-result">`;
                for (let i = 0; i < respData.data.length; i++) {
                    replaceElement += `
                            <a href="video.html?v=${respData['data'][i]['id_video']}" class="text-decoration-none text-white nav-video">
                                <div class="card bg-transparent text-white mx-3">
                                    <div class="card-body">
                                        ${respData['data'][i]['judul']}
                                        <p class="border-top text-center mb-0 mt-1 font-weight-lighter">
                                        <i class="fas fa-folder-open"></i> ${respData['data'][i]['kategori']}
                                        </p>
                                    </div>
                                </div>
                            </a>`;
                }
                replaceElement += `</div><p class="text-center my-4">Ditampilkan <strong>${respData['dataInPage']}</strong> video</p><p class="my-4 text-center"><a href="index.html" class="btn btn-sm btn-outline-light">Home</a></p>`;
                $('#mainId').html(replaceElement);
                sliderResult();
            }
        },
        error: function () {
            $('#mainId').html(`<div div class="alert alert-warning mb-3 text-center" role = "alert" id = "ajaxLoadError" ><i class="fas fa-exclamation-triangle fa-fw fa-2x"></i><p class="my-3">Error, terjadi kesalaan saat memuat data</p><a href="${window.location.href}" class="btn tbn-sm btn-outline-dark">Reload</a></div>`);
        }
    });
}

// berikan efek slider untuk result
function sliderResult() {
    $('.slider-result').slick({
        dots: false,
        arrows: false,
        infinite: true,
        centerMode: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerPadding: '60px',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: false,
                    centerPadding: '40px',
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: false,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    });
}
