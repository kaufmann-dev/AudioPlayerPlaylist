$(document).ready(function() {

	// STYLING
	$('.grid-container').draggable({
		start: function() {
			$(this).css({transform: "none", top: $(this).offset().top+"px", left:$(this).offset().left+"px"});
		},
		containment: '.grid-container-wrapper'
	});

	$(window).resize(function() {
		if(document.getElementsByClassName('grid-container')[0].getBoundingClientRect().right > document.getElementsByClassName('grid-container-wrapper')[0].getBoundingClientRect().right || document.getElementsByClassName('grid-container')[0].getBoundingClientRect().bottom > document.getElementsByClassName('grid-container-wrapper')[0].getBoundingClientRect().bottom || $('.grid-container').position().left < $('.grid-container-wrapper').position().left || $('.grid-container').position().top < $('.grid-container-wrapper').position().top) {
			if(window.innerWidth - document.getElementsByClassName('grid-container')[0].getBoundingClientRect().right + 20 < $('.grid-container').position().left || window.innerWidth - document.getElementsByClassName('grid-container')[0].getBoundingClientRect().right - 20 > $('.grid-container').position().left || document.getElementsByClassName('grid-container-wrapper')[0].getBoundingClientRect().bottom - document.getElementsByClassName('grid-container')[0].getBoundingClientRect().bottom + 20 < $('.grid-container').position().top || document.getElementsByClassName('grid-container-wrapper')[0].getBoundingClientRect().bottom - document.getElementsByClassName('grid-container')[0].getBoundingClientRect().bottom - 20 > $('.grid-container').position().top) {
				$('.grid-container').css('opacity', '0');
				$('.grid-container').css('top', '50%');
				$('.grid-container').css('left', '50%');
				$('.grid-container').css('transform', 'translate(-50%, -50%)');

				$('.grid-container').animate({opacity:1}, 400);
			}
		}
	});

	$(document).mouseup(function() {
		if(document.getElementsByClassName('grid-container')[0].getBoundingClientRect().right > document.getElementsByClassName('grid-container-wrapper')[0].getBoundingClientRect().right || document.getElementsByClassName('grid-container')[0].getBoundingClientRect().bottom > document.getElementsByClassName('grid-container-wrapper')[0].getBoundingClientRect().bottom || $('.grid-container').position().left < $('.grid-container-wrapper').position().left || $('.grid-container').position().top < $('.grid-container-wrapper').position().top) {
			if(window.innerWidth - document.getElementsByClassName('grid-container')[0].getBoundingClientRect().right + 20 < $('.grid-container').position().left || window.innerWidth - document.getElementsByClassName('grid-container')[0].getBoundingClientRect().right - 20 > $('.grid-container').position().left || document.getElementsByClassName('grid-container-wrapper')[0].getBoundingClientRect().bottom - document.getElementsByClassName('grid-container')[0].getBoundingClientRect().bottom + 20 < $('.grid-container').position().top || document.getElementsByClassName('grid-container-wrapper')[0].getBoundingClientRect().bottom - document.getElementsByClassName('grid-container')[0].getBoundingClientRect().bottom - 20 > $('.grid-container').position().top) {
				$('.grid-container').css('opacity', '0');
				$('.grid-container').css('top', '50%');
				$('.grid-container').css('left', '50%');
				$('.grid-container').css('transform', 'translate(-50%, -50%)');

				$('.grid-container').animate({opacity:1}, 400);
			}
		}
	});

	$('.grid-container').click(function() {
		if(window.innerWidth - this.getBoundingClientRect().right + 20 < $(this).position().left || window.innerWidth - this.getBoundingClientRect().right - 20 > $(this).position().left || document.getElementsByClassName('grid-container-wrapper')[0].getBoundingClientRect().bottom - this.getBoundingClientRect().bottom + 20 < $(this).position().top || document.getElementsByClassName('grid-container-wrapper')[0].getBoundingClientRect().bottom - this.getBoundingClientRect().bottom - 20 > $(this).position().top) {
			console.log("no error");
		}
	});

	/*
		$('.grid-container').mousedown(function() {
			$(window).scroll(function() {
				$('.grid-container').draggable({ revert: true });
			});
		});

		setTimeout(function() {
			$('.grid-container').draggable({ revert: false });
		}, 1);

		$('.grid-container').animate({opacity:0}, 200, function() {
			$('.grid-container').css('opacity', '0');
			$('.grid-container').css('top', '50%');
			$('.grid-container').css('left', '50%');
			$('.grid-container').css('transform', 'translate(-50%, -50%)');
		} );
	*/

	// INDEPENDENT
	var lastsong;
	var currentsong;
	var nextsong;
	var currentfilename;
	var sTitle;
	var sArtist;
	var durationUpdater;

	$('.playlist .song').click(function() {
		eval(currentsong + '.stop()');
		let howl_name = $(this).attr('id');
		eval(howl_name + '.play()');

		setTimeout(function() {
			UpdateT1();
			UpdateAppearance();
			UpdatePlayPause('pause');
			UpdateT2();
		}, 40);
	});

	$('.rewind').click(function() {
		if(eval(currentsong + '._sounds[0]._seek') > 10 || eval(currentsong + '.seek()') > 10) {
			eval(currentsong + '.seek(0)');
			UpdateT1();
		} else if(lastsong) {
			eval(currentsong + '.stop()');
			eval(lastsong + '.play()');
			
			setTimeout(function() {
				UpdateT1();
				UpdateAppearance();
				UpdatePlayPause('pause');
				UpdateT2();
			}, 40);
		} else {
			$.notify("ERROR: first song", "error");
		}
	});

	$('.skip').click(function() {
		if(nextsong) {
			eval(currentsong + '.stop()');
			eval(nextsong + '.play()');

			setTimeout(function() {
				UpdateT1();
				UpdateAppearance();
				UpdatePlayPause('pause');
				UpdateT2();
			}, 40);
		} else {
			$.notify("ERROR: last song", "error");
		}
	});

	$('.stop').click(function() {
		eval(currentsong + '.stop()');

		UpdatePlayPause('play');
		UpdateT1();
	});

	$('.download').click(function() {
		window.open('mp3/' + currentsong + '.mp3', '_blank');
	});

	$('.play_pause').click(function() {
		if(GetPlayPause() == 'play') {
			UpdatePlayPause('pause');
			eval(currentsong + '.play()');
		} else if(GetPlayPause() == 'pause') {
			UpdatePlayPause('play');
			eval(currentsong + '.pause()');
		} else {
			$.notify("ERROR: $('.play_pause').click: GetPlayPause() returns neither 'play' or 'pause'", "error");
		}
	});

	$('.volume').click(function(e) {
		if($(e.target).is('.volume input[type=range]')) {
			return;
		}

		if($(this).hasClass('red')) {
			$(this).removeClass('red');
			$(this).addClass('green');
			if($('.volume input[type=range]').val() == 0) {
				Howler.volume(0.1);
				$('.volume input[type=range]').val(0.1);
			} else {
				Howler.volume($('.volume input[type=range]').val());
			}
			//$('.volume').css('background-image', 'url("file:///C:/Users/David/Desktop/audio-player-playlist/img/volume_bg.png")');
			$('.volume img').attr('src', 'img/volume_bg.png');
		} else if($(this).hasClass('green')) {
			Howler.volume(0);
			$(this).removeClass('green');
			$(this).addClass('red');
			//$('.volume').css('background-image', 'url("file:///C:/Users/David/Desktop/audio-player-playlist/img/volume_crossed_bg.png")');
			$('.volume img').attr('src', 'img/volume_crossed_bg.png');
		} else {
			$.notify("ERROR: .volume neither has class 'green' or 'red'", "error");
		}
	});

	$('.volume input[type=range]').on('input', function () {
		let volume_value = $(this).val();

		if(volume_value == 0) {
			$('.volume').removeClass('green');
			$('.volume').addClass('red');
			Howler.volume(0);
			//$('.volume').css('background-image', 'url("file:///C:/Users/David/Desktop/audio-player-playlist/img/volume_crossed_bg.png")');
			$('.volume img').attr('src', 'img/volume_crossed_bg.png');
		} else if($('.volume').hasClass('red')) {
			$('.volume').removeClass('red');
			$('.volume').addClass('green');
			Howler.volume(volume_value);
			//$('.volume').css('background-image', 'url("file:///C:/Users/David/Desktop/audio-player-playlist/img/volume_bg.png")');
			$('.volume img').attr('src', 'img/volume_bg.png');
		} else {
			Howler.volume(volume_value);
		}
	});

	$('.duration-main input[type=range]').on('input', function () {
		let duration_value = $('.duration-main input[type=range]').val();
		eval(currentsong + '.seek(' + duration_value + ')');
		$('.duration-left').html(CalculateT1(eval(currentsong + '._sounds[0]._seek')));
	});

	function CalculateT1(a) {
		a = Math.round(a);
		let a2 = JSON.stringify(Math.floor(a / 60));
		let a1 = JSON.stringify(a - a2 * 60);
		if (parseInt(a1) < 10) {a1 = "0" + a1}
		if (parseInt(a2) < 10) {a2 = "0" + a2}

		return a2 + ":" + a1;
	}

	function CalculateT2(b) {
		b = Math.round(b);
		let b2 = JSON.stringify(Math.floor(b / 60));
		let b1 = JSON.stringify(b - b2 * 60);
		if (parseInt(b1) < 10) {b1 = "0" + b1}
		if (parseInt(b2) < 10) {b2 = "0" + b2}

		return b2 + ":" + b1;
	}

	function UpdateAppearance() {
		$('.song-title').css('font-size', '35px');
		$('.song-title').html(sTitle);
		$('.song-title').autoshrink();
		$('.song-artist').css('font-size', '25px');
		$('.song-artist').html(sArtist);
		$('.song-artist').autoshrink();
		//$('.img-container').css('background-image', 'url("file:///C:/Users/David/Desktop/audio-player-playlist/img/' + currentfilename + '")');
		$('.img-container img').attr('src', 'img/' + currentfilename);
	}

	function UpdatePlayPause(x) {
		if(x == 'play') {
			//$('.play_pause').css('background-image', 'url("file:///C:/Users/David/Desktop/audio-player-playlist/img/play.png")');
			$('.play_pause img').attr('src', 'img/play.png');
		} else if(x == 'pause') {
			//$('.play_pause').css('background-image', 'url("file:///C:/Users/David/Desktop/audio-player-playlist/img/pause.png")');
			$('.play_pause img').attr('src', 'img/pause.png');
		} else {
			$.notify("ERROR: UpdatePlayPause: got neither 'play' or 'pause'", "error");
		}
	}

	function GetPlayPause() {
		/*if($('.play_pause').css('background-image') == 'url("file:///C:/Users/David/Desktop/audio-player-playlist/img/play.png")') {
			return 'play';
		} else if ($('.play_pause').css('background-image') == 'url("file:///C:/Users/David/Desktop/audio-player-playlist/img/pause.png")') {
			return 'pause';
		}*/
		if($('.play_pause img').attr('src') == 'img/play.png') {
			return 'play';
		} else if ($('.play_pause img').attr('src') == 'img/pause.png') {
			return 'pause';
		} else {
			$.notify("ERROR: GetPlayPause: background is neither 'img/play.png' or 'img/pause.png'", "error");
		}
	}

	function UpdateT1() {
		$('.duration-main input[type=range]').val(eval(currentsong + '.seek()'));
		$('.duration-left').html(CalculateT1(eval(currentsong + '.seek()')));
	}

	function UpdateT2() {
		$('.duration-main input[type=range]').attr('max', eval(currentsong + '.duration()'));
		$('.duration-right').html(CalculateT2(eval(currentsong + '.duration()')));
	}

	// everytime_we_touch
	var everytime_we_touch = new Howl({
		src: ['mp3/everytime_we_touch.mp3'],
		preload: true,
		autoplay: false,
		volume: 1,
		onload: function() {
			lastsong = null;
			currentsong = 'everytime_we_touch';
			nextsong = 'rockefeller_street';
			currentfilename = 'everytime_we_touch.png';
			sTitle = 'Everytime We Touch (Nightcore)';
			sArtist = 'Cascada';

			UpdateAppearance();
			UpdateT2();
		},
		onplay: function() {
			lastsong = null;
			currentsong = 'everytime_we_touch';
			nextsong = 'rockefeller_street';
			currentfilename = 'everytime_we_touch.png';
			sTitle = 'Everytime We Touch (Nightcore)';
			sArtist = 'Cascada';

			durationUpdater = setInterval(function(){
				UpdateT1();
				console.log(currentsong + ': song-progress updated');
			},500);
		},
		onend: function() {
			if(nextsong) {
				eval(nextsong + '.play()');
				UpdateT1();
				UpdateAppearance();
				UpdatePlayPause('pause');
				UpdateT2();
			} else {
				UpdateT1();
				UpdatePlayPause('play');
			}

			clearInterval(durationUpdater);

		},
		onstop: function() {
			clearInterval(durationUpdater);
		},
		onpause: function() {
			clearInterval(durationUpdater);
		}
	});

	// rockefeller_street
	var rockefeller_street = new Howl({
		src: ['mp3/rockefeller_street.mp3'],
		preload: true,
		autoplay: false,
		volume: 1,
		onplay: function() {
			lastsong = 'everytime_we_touch';
			currentsong = 'rockefeller_street';
			nextsong = 'caramelldansen';
			currentfilename = 'rockefeller_street.png';
			sTitle = 'Rockefeller Street (Nightcore)';
			sArtist = 'Getter Jaani';

			durationUpdater = setInterval(function(){
				UpdateT1();
				console.log(currentsong + ': song-progress updated');
			},500);
		},
		onend: function() {
			if(nextsong) {
				eval(nextsong + '.play()');
				UpdateT1();
				UpdateAppearance();
				UpdatePlayPause('pause');
				UpdateT2();
			} else {
				UpdateT1();
				UpdatePlayPause('play');
			}

			clearInterval(durationUpdater);

		},
		onstop: function() {
			clearInterval(durationUpdater);
		},
		onpause: function() {
			clearInterval(durationUpdater);
		}
	});

	// caramelldansen
	var caramelldansen = new Howl({
		src: ['mp3/caramelldansen.mp3'],
		preload: true,
		autoplay: false,
		volume: 1,
		onplay: function() {
			lastsong = 'rockefeller_street';
			currentsong = 'caramelldansen';
			nextsong = null;
			currentfilename = 'caramelldansen.gif';
			sTitle = 'Caramelldansen';
			sArtist = 'Caramella Girls';

			durationUpdater = setInterval(function(){
				UpdateT1();
				console.log(currentsong + ': song-progress updated');
			},500);
		},
		onend: function() {
			if(nextsong) {
				eval(nextsong + '.play()');
				UpdateT1();
				UpdateAppearance();
				UpdatePlayPause('pause');
				UpdateT2();
			} else {
				UpdateT1();
				UpdatePlayPause('play');
			}

			clearInterval(durationUpdater);

		},
		onstop: function() {
			clearInterval(durationUpdater);
		},
		onpause: function() {
			clearInterval(durationUpdater);
		}
	});
	
});

// $('.grid-container').off();
// $(document).off('mouseup');

// let time = Number(mySound.seek())
// if (isNaN(time)) {
// 	time = mySound._sounds[0]._seek;
// }