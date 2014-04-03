$(document).ready(function() {
  var menu = "<h3>Icarus</h3><p><a href=\"http://icarus.jvscott.net\">Home</a><br /><a href=\"media.html\">Media</a><br /><a href=\"http://www.indiedb.com/games/icarus/downloads/icarus-demo\">Demo</a><br /><a href=\"goals.html\">My Goals</a><br /><a href=\"requirements.html\">Requirements</a></p><h3>Community</h3><p><a href=\"reviews.html\">Reviews</a><br /><a href=\"http://blog.jvscott.net\">Dev Blog</a><br /><a href=\"http://www.indiedb.com/games/icarus\">IndieDB Page</a><br /></p>";
  var email = "<br/><a href=\"mailto:jvscott@gmail.com\"><img src=\"email.png\" title=\"Email the Developer\"/></a>"
  var like = "<br/><a href=\"http://www.facebook.com/pages/Icarus/133860083359927\"><img src=\"fb.png\" title=\"Icarus Facebook Page\"/></a>";
  var tweet = "<br/><div style=\"text-align:center\"><a href=\"http://twitter.com/share\" class=\"twitter-share-button\" data-url=\"http://icarus.jvscott.net\" data-count=\"none\">Tweet</a><script type=\"text/javascript\" src=\"http://platform.twitter.com/widgets.js\"></script></div>";
  $("td#right").html(menu + email + tweet);

    $("p:not(.no_gold)").each(function () {
      $(this).html($(this).html().replace("Icarus", "<span class=\"gold\">Icarus<\/span>"));
    });
});
