const apiSrv = window.location.origin + '/myvideo/api/index.php';
const elemHariTanggal = document.getElementById('hariTanggal');
const changeToggleSidebar = document.getElementById('accordionSidebar');

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

// minta data untuk isi kategori
$.ajax({
    url: apiSrv,
    type: 'get',
    data: {
        page: 'getData',
        kategori: 'aktif'
    },
    beforeSend: function () {
        // createAjaxLoader();
    },
    success: function (resp) {
        let respData = JSON.parse(resp);
        // console.log(respData);
        if (respData['status'] == 404) {
            $('#value-kategori').html(`
            <div class="alert alert-info mb-3 text-center" role="alert">
              <i class="fas fa-exclamation-circle fa-fw fa-2x"></i>
              <p class="mb-0">Tidak ada kategori tersedia</p>
            </div>
            `);
        } else if (respData['status'] == 200) {
            let replaceElement = '<h1 class="h4 mb-3 text-gray-500">Kategori</h1><div class="slider-kategori">';
            for (let i = 0; i < respData.data.length; i++) {
                replaceElement += `
                <a href="search.html?q=${respData['data'][i]['judul']}" class="text-decoration-none text-white nav-video">
                    <div class="card bg-secondary text-white mx-3">
                        <div class="card-body">
                            ${respData['data'][i]['judul']}
                        </div>
                    </div>
                </a>`;
            }
            replaceElement += '</div>';
            $('#value-kategori').html(replaceElement);
            sliderKategori();
        }
    },
    error: function () {
        createAjaxLoadError();
    }
});

// minta data video populer
$.ajax({
    url: apiSrv,
    type: 'get',
    data: {
        page: 'getData',
        videoPopuler: 10
    },
    beforeSend: function () {
        // createAjaxLoader();
    },
    success: function (resp) {
        let respData = JSON.parse(resp);
        // console.log(respData);
        if (respData['status'] == 404) {
            $('#value-videoPopuler').html(`            
            <div class="alert alert-info mb-3 text-center" role="alert">
              <i class="fas fa-exclamation-circle fa-fw fa-2x"></i>
              <p class="mb-0">Tidak ada data video populer tersedia</p>
            </div>
            `);
        } else if (respData['status'] == 200) {
            let replaceElement = '<h1 class="h4 mb-3 text-gray-500">Video Populer</h1><div class="slider-videoPopuler">';
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
            $('#value-videoPopuler').html(replaceElement);
            sliderVideoPopuler();
        }
    },
    error: function () {
        createAjaxLoadError();
    }
});

// minta data video terbaru
$.ajax({
    url: apiSrv,
    type: 'get',
    data: {
        page: 'getData',
        videoNew: 10
    },
    beforeSend: function () {
        // createAjaxLoader();
    },
    success: function (resp) {
        let respData = JSON.parse(resp);
        // console.log(respData);
        if (respData['status'] == 404) {
            $('#value-videoNew').html(`
            <div class="alert alert-info mb-3 text-center" role="alert">
              <i class="fas fa-exclamation-circle fa-fw fa-2x"></i>
              <p class="mb-0">Tidak ada data video terbaru tersedia</p>
            </div>
            `);
        }
        else if (respData['status'] == 200) {
            let replaceElement = '<h1 class="h4 mb-3 text-gray-500">Video Terbaru</h1><div class="slider-videoNew">';
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
            $('#value-videoNew').html(replaceElement);
            sliderVideoNew();
        }
    },
    error: function () {
        createAjaxLoadError();
    }
});

// berikan efek slider untuk kategori
function sliderKategori() {
    $('.slider-kategori').slick({
        dots: false,
        arrows: false,
        infinite: true,
        centerMode: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
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

// berikan efek slider untuk kategori
function sliderVideoPopuler() {
    $('.slider-videoPopuler').slick({
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

// berikan efek slider untuk kategori
function sliderVideoNew() {
    $('.slider-videoNew').slick({
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

// create elem ajax laoder
function createAjaxLoader() {
    if (document.getElementById('ajaxLoader') == null)
        $('#mainId').html(`<p p class="text-center small text-muted" id = "ajaxLoader" ><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span></p>`);
}

function createAjaxLoadError() {
    if (document.getElementById('ajaxLoadError') == null)
        $('#mainId').html(`<div div class="alert alert-warning mb-3 text-center" role = "alert" id = "ajaxLoadError" ><i class="fas fa-exclamation-triangle fa-fw fa-2x"></i><p class="my-3">Error, terjadi kesalaan saat memuat data</p><a href="${window.location.href}" class="btn tbn-sm btn-outline-dark">Reload</a></div>`);
}
