const host = window.location.origin + '/';
const apiSrv = window.location.origin + '/myvideo/api/index.php';
const video = document.querySelector('.video');
const progress = document.querySelector('.video-progress');
const progressBar = document.querySelector('.video-progress-filled');
const playPause = document.getElementById('play-pause');
const mute = document.getElementById('mute-unmute');
const btnFullscreen = document.getElementById('fullscreen');
const elemFullscreen = document.querySelector('.c-video');
const currentTimeElement = document.querySelector('.current');
const durationTimeElement = document.querySelector('.duration');
const btnVideoInfo = document.getElementById('btn-video-info');
const elemCountDownTimer = document.getElementById('video-ended-countDown');
const btnVideoNext = document.getElementById('video-next');
const btnVideoAutoplay = document.getElementById('autoplay');
const statusAutoplay = document.getElementById('autoplay-status');
const elemVideoControls = document.querySelector('.controls');
const elemVideoHeader = document.querySelector('.video-header');
const btnHome = document.getElementById('home');
const btnSearch = document.getElementById('search');
const tmpViewId = randomStringPattern(Math.floor((Math.random() * 10) + 3)); //bil acak 3 s/d 10
const valueSeekTime = 3;
var moveSeekTime = progressBar.value;
var countdownTimer = 10; // dalam detik
var tmpAutoplay = 0;
var tmpConfirmNextVideo = 1;
var tmpPlayed = '';
var tmpVideoInfo = '';
var hidePanelTimeOut;

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
// console.log(getUrlVars('v'));
const v = getUrlVars('v');
(v == undefined) ? nullVideoPage() : videoPage(v);

// v == undefined
function nullVideoPage() {
    $('#video-ended-status').html(`<i class="fa fa-exclamation-triangle fa-3x fa-fw"></i><br><p>Error, tidak dapat memutar video</p><br><a href="index.html" id="btn-cancel-video-ended" style="text-decoration: none;">Home</a>`).parent().css('visibility', 'visible');
    setTimeout(() => { $('#btn-cancel-video-ended').focus(); }, 200);
}

// cari data untuk diplay
function videoPage(v) {
    $.ajax({
        url: apiSrv,
        type: 'get',
        data: {
            page: 'getData',
            v: v
        },
        beforeSend: function () {
            $('#video-ended-status').html(`<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>`).parent().css('visibility', 'visible');
        },
        success: function (resp) {
            let respData = JSON.parse(resp);
            // console.log(respData);
            if (respData['status'] == 404) {
                $('#video-ended-status').html(`<i class="fa fa-video-slash fa-3x fa-fw"></i><br><p>Error, gagal memuat video</p><br><a href="index.html" id="btn-cancel-video-ended" style="text-decoration: none;">Home</a>`);
                $('#btn-cancel-video-ended').focus();
            } else if (respData['status'] == 200) {
                video.setAttribute('src', respData['data']['target']);
                // ubah tmpPlayed
                tmpPlayed = respData['data']['id_video'];
                $('.video-title').html(respData['data']['judul']);
                $('title').text(respData['data']['judul']);
                $('#video-ended-status').html('').parent().css('visibility', 'hidden');
                tmpVideoInfo = `<div class="card"><div class="card-header">${respData['data']['judul']}</div><div class="card-body"><div class="video-statistik"><div class="video-statistik-like"><i class="fas fa-fw fa-thumbs-up"></i><br>${respData['data']['video_like']}</div><div class="video-statistik-view"><i class="fas fa-fw fa-eye"></i><br>${respData['data']['viewer']}</div><div class="video-statistik-dislike"><i class="fas fa-fw fa-thumbs-down"></i><br>${respData['data']['video_dislike']}</div></div><div class="video-statistik"><div class="video-statistik-kategori"><i class="fas fa-fw fa-folder-open"></i><br>${respData['data']['kategori']}</div><div class="video-statistik-user"><i class="fas fa-fw fa-user"></i><br>${respData['data']['id_user']}</div><div class="video-statistik-dislike"><i class="fas fa-fw fa-broadcast-tower"></i><br>${respData['data']['tanggal']}</div></div><div>${respData['data']['keterangan']}</div></div><div class="card-footer"><button id="btn-cancel-video-ended" class="close-video-info" style="color: black; border-radius: .25rem;" onclick="closeVideoInfo();">Tutup</button></div></div>`;
            }
        },
        error: function () {
            $('#btn-cancel-video-ended').remove();
            $('#video-ended-status').html(`<i class="fa fa-exclamation-triangle fa-3x fa-fw"></i><br><p>Error, tidak dapat terhubung ke server</p><br><a href="${window.location.href}" id="btn-cancel-video-ended" style="text-decoration: none;">Coba lagi</a>`).parent().css('visibility', 'visible');
            $('#btn-cancel-video-ended').focus();
        }
    });
}

// buat tmpView untuk kebutuhan nextvideo
function randomStringPattern(jmlKarakter) {
    var text = "";
    var possible = "'0987654321_AaBbCcDdEeF-fGgHhIiJjKkLl_MmNnOoPpQqRrSsTtUuVv_WwXxYyZz-01234567890_";
    for (var j = 0; j < parseInt(jmlKarakter); j++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// if document ready then do this
window.addEventListener('DOMContentLoaded', () => {
    // set focus to playbtn
    playPause.focus();
    // video click then play video
    video.addEventListener('click', () => {
        tooglePlayPause();
    });
    // video dblclick then fullsreen
    video.addEventListener('dblclick', () => {
        fullscreenMode();
    });
});

function tooglePlayPause() {
    if (video.paused) {
        playPause.className = 'pause';
        progressBar.setAttribute('step', '0.01');
        video.play();
        clearTimeout(hidePanelTimeOut);
        hidePanel();
    } else {
        playPause.className = 'play';
        video.pause();
        clearTimeout(hidePanelTimeOut);
        showPanel();
        hidePanel();
    }
}

// showHide panel judul dan controls
function showPanel() {
    elemVideoControls.setAttribute('class', 'controls');
    elemVideoHeader.setAttribute('class', 'video-header');
    if (document.activeElement.className == 'video') {
        playPause.focus();
    }
}

function hidePanel() {
    hidePanelTimeOut = setTimeout(function () {
        // console.log('tutup panel');
        elemVideoControls.setAttribute('class', 'controls collapsed');
        elemVideoHeader.setAttribute('class', 'video-header toggled');
    }, 8000);
};

// tampilkan panel ketika mouse hover
document.onmouseover = () => {
    clearTimeout(hidePanelTimeOut);
    showPanel();
    hidePanel();
};

function fullscreenMode() {
    if (
        document.fullscreenElement || /* Standard syntax */
        document.webkitFullscreenElement || /* Chrome, Safari and Opera syntax */
        document.mozFullScreenElement ||/* Firefox syntax */
        document.msFullscreenElement /* IE/Edge syntax */
    ) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        btnFullscreen.classList.toggle('fullscreen');
    } else {
        if (elemFullscreen.requestFullscreen) {
            elemFullscreen.requestFullscreen();
        } else if (elemFullscreen.webkitRequestFullscreen) { /* Safari */
            elemFullscreen.webkitRequestFullscreen();
        } else if (elemFullscreen.msRequestFullscreen) { /* IE11 */
            elemFullscreen.msRequestFullscreen();
        }
        btnFullscreen.classList.toggle('fullscreen');
    }
}

playPause.onclick = function () {
    tooglePlayPause();
};

video.addEventListener('timeupdate', function () {
    // untuk menampilkan waktu video
    let precentage = (video.currentTime / video.duration) * 100;
    progressBar.value = `${precentage}`;
    // console.log(precentage)
    if (video.ended) {
        playPause.className = 'play';
    }
});

// ketika video berakhir
video.addEventListener('ended', () => {
    // console.log('end');
    // jika autoplay nyala
    if (tmpAutoplay == 1) {
        playPause.className = 'play';
        getDataToNextVideo();
        tmpConfirmNextVideo = 1;
        createCancelNextVideo();
        $('#btn-cancel-video-ended').focus();
    } else if (tmpAutoplay == 0) {
        clearTimeout(hidePanelTimeOut);
        showPanel();
        hidePanel();
    }
});

function kdSeekTime(event) {
    // panah atas
    if (event.keyCode == 38) {
        progressBar.value = progressBar.value - valueSeekTime;
        progressBar.blur();
        btnVideoInfo.focus();
        tooglePlayPause();
    }

    // panah bawah
    if (event.keyCode == 40) {
        progressBar.value = progressBar.value + valueSeekTime;
        progressBar.blur();
        playPause.focus();
        tooglePlayPause();
    }

    // ener n space
    if ((event.keyCode == 13) || (event.keyCode == 32)) {
        progressBar.setAttribute('step', '0.01');
        tooglePlayPause();
    }
}

function inSeekTime(value) {
    moveSeekTime = value;
    // video.pause();
    progressBar.setAttribute('step', valueSeekTime);
    let seekTime = (moveSeekTime / 100) * video.duration;
    video.currentTime = seekTime;
    tooglePlayPause();
}

function foSeekTime(value) {
    moveSeekTime = value;
    // video.pause();
    progressBar.setAttribute('step', valueSeekTime);
    let seekTime = (moveSeekTime / 100) * video.duration;
    video.currentTime = seekTime;
}

// current time and duration
const currentTime = () => {
    let currentMinutes = Math.floor(video.currentTime / 60);
    let currentSeconds = Math.floor(video.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(video.duration / 60);
    let durationSeconds = Math.floor(video.duration - durationMinutes * 60);
    currentTimeElement.innerHTML = `${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;
    durationTimeElement.innerHTML = `${durationMinutes}:${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}`;
}
video.addEventListener('timeupdate', currentTime);

// mute button
mute.addEventListener('click', () => {
    video.muted = !video.muted;
    mute.classList.toggle('muted');
});

// buttn fullscreen
btnFullscreen.addEventListener('click', () => {
    fullscreenMode();
});

// minta data untuk video diputar
var idVideoNextVideo = '';
var judulNextVideo = '';
var targetNextVideo = '';
function getDataToNextVideo() {
    $.ajax({
        url: apiSrv,
        type: 'get',
        data: {
            page: 'getData',
            nextVid: tmpPlayed,
            uid: tmpViewId
        },
        beforeSend: function () {
            $('#video-ended-status').html(`<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>`).parent().css('visibility', 'visible');
        },
        success: function (resp) {
            let respData = JSON.parse(resp);
            // console.log(respData);
            if (respData['status'] == 404) {
                $('#video-ended-status').html(`<i class="fa fa-video-slash fa-3x fa-fw"></i><br><p>Error, gagal memuat video</p><br><a href="index.html" id="btn-cancel-video-ended" style="text-decoration: none;">Home</a>`);
                $('#btn-cancel-video-ended').focus();
            } else if (respData['status'] == 200) {
                $('#video-ended-status').html(`Selanjutnya,<br>` + respData['data']['judul'] + `<br><small id="video-ended-countDown">10</small>`);
                countDown();
                idVideoNextVideo = respData['data']['id_video'];
                judulNextVideo = respData['data']['judul'];
                targetNextVideo = respData['data']['target'];
                tmpVideoInfo = `<div class="card"><div class="card-header">${respData['data']['judul']}</div><div class="card-body"><div class="video-statistik"><div class="video-statistik-like"><i class="fas fa-fw fa-thumbs-up"></i><br>${respData['data']['video_like']}</div><div class="video-statistik-view"><i class="fas fa-fw fa-eye"></i><br>${respData['data']['viewer']}</div><div class="video-statistik-dislike"><i class="fas fa-fw fa-thumbs-down"></i><br>${respData['data']['video_dislike']}</div></div><div class="video-statistik"><div class="video-statistik-kategori"><i class="fas fa-fw fa-folder-open"></i><br>${respData['data']['kategori']}</div><div class="video-statistik-user"><i class="fas fa-fw fa-user"></i><br>${respData['data']['id_user']}</div><div class="video-statistik-dislike"><i class="fas fa-fw fa-broadcast-tower"></i><br>${respData['data']['tanggal']}</div></div><div>${respData['data']['keterangan']}</div></div><div class="card-footer"><button id="btn-cancel-video-ended" class="close-video-info" style="color: black; border-radius: .25rem;" onclick="closeVideoInfo();">Tutup</button></div></div>`;
            }
        },
        error: function () {
            $('#btn-cancel-video-ended').remove();
            $('#video-ended-status').html(`<i class="fa fa-exclamation-triangle fa-3x fa-fw"></i><br><p>Error, tidak dapat terhubung ke server</p><br><a href="${window.location.href}" id="btn-cancel-video-ended" style="text-decoration: none;">Coba lagi</a>`).parent().css('visibility', 'visible');
            $('#btn-cancel-video-ended').focus();
        }
    });
}

function countDown() {
    if (tmpConfirmNextVideo == 1) {
        if (countdownTimer > 0) {
            countdownTimer = countdownTimer - 1;
            var waktu = countdownTimer + 1;
            $('#video-ended-countDown').html(waktu);
            setTimeout("countDown()", 1000);
        } else {
            $('#btn-cancel-video-ended').remove();
            $('#video-ended-status').html(`<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>`);
            nextVideo();
            countdownTimer = 10;
        }
    } else if (tmpConfirmNextVideo == 0) {
        $('#video-ended-status').html('').parent().css('visibility', 'hidden');
        setTimeout(() => {
            $('#btn-cancel-video-ended').remove();
            showPanel();
            playPause.focus();
            countdownTimer = 10;
        }, 300);
    }
}

function nextVideo() {
    video.setAttribute('src', targetNextVideo);
    tmpPlayed = idVideoNextVideo;
    $('.video-title').html(judulNextVideo);
    $('title').text(judulNextVideo);
    setTimeout(() => {
        $('#video-ended-status').html('').parent().css('visibility', 'hidden');
        tooglePlayPause();
    }, 1000);
}

// btn next video
btnVideoNext.addEventListener('click', () => {
    video.pause();
    playPause.className = 'play';
    getDataToNextVideo();
    tmpConfirmNextVideo = 1;
    createCancelNextVideo();
    $('#btn-cancel-video-ended').focus();
});

function createCancelNextVideo() {
    if (document.getElementById('btn-cancel-video-ended') == null)
        $('.video-ended').append(`<button id="btn-cancel-video-ended" onclick="abortNextVideo();">Batal</button>`);
}

// btn autoplay
btnVideoAutoplay.addEventListener('click', () => {
    if (tmpAutoplay == 1) {
        tmpAutoplay = 0;
        statusAutoplay.innerHTML = 'Autoplay mati';
        btnVideoAutoplay.classList.toggle('autoplay-on');
    } else if (tmpAutoplay == 0) {
        tmpAutoplay = 1;
        statusAutoplay.innerHTML = 'Autoplay aktif';
        btnVideoAutoplay.classList.toggle('autoplay-on');
    }
});

// pindah ke home ketika btn dipencet
btnHome.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// pindah ke home ketika btn dipencet
btnSearch.addEventListener('click', () => {
    window.location.href = 'search.html';
});

// btn info on click
btnVideoInfo.addEventListener('click', () => {
    $('.video-ended').html(tmpVideoInfo).css('visibility', 'visible');
    playPause.className = 'play';
    video.pause();
    $('.video-header, .controls').slideUp('slow');
    document.querySelector('.close-video-info').focus();
});

// tutup video info
function closeVideoInfo() {
    $('.video-ended').css('visibility', 'hidden');
    $('.video-header, .controls').slideDown('slow');
    showPanel();
    if (document.activeElement.className == 'video') {
        playPause.focus();
    }
    playPause.className = 'pause';
    video.play();
}

// tampilkan panel ketika mencet sesuatu
document.addEventListener('keyup', () => {
    clearTimeout(hidePanelTimeOut);
    showPanel();
    hidePanel();
});

// btn abort next video
function abortNextVideo() {
    tmpConfirmNextVideo = 0;
    $('#btn-cancel-video-ended').html('Membatalkan...');
}