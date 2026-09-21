// Demo clips on the research project pages.
// They are muted, looping and decorative. The autoplay attribute alone is not
// enough: browsers defer autoplay for offscreen media and refuse it outright
// without the muted/inline hints, so start each clip once it is near the
// viewport and retry on scroll. Groups tagged with data-video-sync stay in step.
(function () {
  "use strict";

  var MARGIN = 300; // start slightly before the clip scrolls into view

  function playSafely(video) {
    var attempt = video.play();
    if (!attempt || typeof attempt.catch !== "function") return;
    attempt.catch(function () {
      // iOS in Low Power Mode refuses even muted playback, and a clip with no
      // controls would just sit on its first frame: give the reader a way in
      video.controls = true;
    });
  }

  function nearViewport(video) {
    var rect = video.getBoundingClientRect();
    if (!rect.width && !rect.height) return false; // hidden or not laid out
    var height = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < height + MARGIN && rect.bottom > -MARGIN;
  }

  function keepGroupsInSync(videos) {
    var groups = {};
    videos.forEach(function (video) {
      var name = video.getAttribute("data-video-sync");
      if (!name) return;
      groups[name] = groups[name] || [];
      groups[name].push(video);
    });

    Object.keys(groups).forEach(function (name) {
      var group = groups[name];
      if (group.length < 2) return;
      setInterval(function () {
        var lead = group[0];
        if (lead.paused || !isFinite(lead.currentTime)) return;
        group.slice(1).forEach(function (video) {
          // never seek past the end: a shorter clip would stall there
          if (!isFinite(video.duration) || lead.currentTime >= video.duration) return;
          if (Math.abs(video.currentTime - lead.currentTime) > 0.3) {
            video.currentTime = lead.currentTime;
          }
        });
      }, 10000);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var videos = Array.prototype.slice.call(document.querySelectorAll(".project-container video"));
    if (!videos.length) return;

    videos.forEach(function (video) {
      // muted + inline is what browsers allow to play without a user gesture
      video.muted = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.playsInline = true;
      if (!video.hasAttribute("loop")) video.loop = true;
      // a clip that runs out still needs to come back round
      video.addEventListener("ended", function () {
        if (video.loop) {
          video.currentTime = 0;
          playSafely(video);
        }
      });
    });

    var pending = videos.slice();
    function sweep() {
      pending = pending.filter(function (video) {
        if (!nearViewport(video)) return true;
        playSafely(video);
        return video.paused; // keep retrying until it actually runs
      });
    }

    var timer = null;
    function schedule() {
      if (timer) return;
      timer = window.setTimeout(function () {
        timer = null;
        sweep();
      }, 100);
    }

    sweep();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("load", sweep);
    // catch clips whose layout settles late (fonts, MathJax, lazy images)
    [400, 1200, 3000].forEach(function (delay) {
      window.setTimeout(sweep, delay);
    });

    keepGroupsInSync(videos);
  });
})();
