var last_tweet_id, just_gotten, twitter_template, timer, query_text;

function twitterFormSubmit(){
  if($("#content form").serialize()!=query_text){
    query_text = $("#content form").serialize();
    last_tweet_id = null;
    $('#feed').html('');
  }
  clearTimeout(timer);
  getTweets();
  $("#stop_updating").show();
  
  return false;
}

function getTweets(){
  $('#loading').show()
  url = "http://search.twitter.com/search.json?"+query_text+"&callback=?"
  if (last_tweet_id!=null) {
    url += '&since_id=' + last_tweet_id;
  }
  jQuery.getJSON(url, processTweets)
};

function processTweets(data){
  just_gotten = data;
  last_tweet_id = data.max_id;
  $('#feed li.new-tweet').removeClass('new-tweet');
  data.results.reverse(); 
  
  $.each(data.results, function() { 
    var tweet = twitter_template.clone();
    tweet.addClass('new-tweet');
    tweet.attr('id',this.id)
    tweet.find('.tweet-text').html(this.text);
    tweet.find('.tweet-url').attr('href',"http://twitter.com/"+this.from_user);
    tweet.find('.profile-pic img').attr('src',this.profile_image_url)
    tweet.find('.screen-name').html(this.from_user);
    tweet.hide();
    $('#feed').prepend(tweet);
    tweet.slideDown();
  });
  $('#loading').hide()
  timer = setTimeout(getTweets, 5000);
}

function stopTwittering(){
  clearTimeout(timer);
  $("#stop_updating").hide();
  $("#content form input:first").focus();
}

$(document).ready(function(){
  twitter_template = $('#twitter_template').remove();
  $("#stop_updating").click(stopTwittering);
  $("#content form").submit(twitterFormSubmit);
});