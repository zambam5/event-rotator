// Variables
let settings = {
    "global": {
      "internal_clock": 1000,
        "stats_clock": 60000
  },
  "stats": {
      "refresh_rate": 5 // Seconds
  }
};
let state = {
    "latest": {
      "follower": {
          "enabled": false,
            "name": "",
            "icon": "person",
            "empty": ""
      },
        "subscriber": {
          "enabled": false,
            "name": "",
            "amount": 0,
            "icon": "person",
            "empty": ""
      },
        "donation": {
          "enabled": false,
            "name": "",
            "amount": 0,
            "icon": "person",
            "empty": ""
      },
        "cheer": {
          "enabled": false,
            "name": "",
            "amount": 0,
            "icon": "person",
            "empty": ""
      }}
};
let channelName = '';
let latest_keys;
let latest_pos = 0;
let currency = '';

// Start everything!

function start() {
    // Generate stats_keys variable
    latest_keys = Object.keys(state.latest);


    // Live Viewers/Followers Refresh

    // Start refresh clock
    setInterval(function() {
    
        // Latest
        // Variables
        let latestObject = state.latest[latest_keys[latest_pos]];
        let latestType = latest_keys[latest_pos];
    
        // fadeOut Current
        $('.latest-container').fadeOut(function() {
          // Genereate html
            let text = "";
            text += "<span class='text'>";
            
            // Check if empty
            if (latestObject.name == "") {
              text += latestObject.empty + " <i class='fas fa-" + latestObject.icon + "'></i>";
          } else {
              // Check type
              switch (latestType) {
                  case 'subscriber':
					  text += latestObject.name + " <span class='accent'>" + latestObject.amount + "" + ((latestObject.amount > 1) ? "x" : "x") + "</span>";
                  break;
                  case 'donation':
                      text += latestObject.name + " <span class='accent'>" + currency + latestObject.amount.toFixed(2) + "</span>";
                  break;
                  case 'cheer':
                      text += latestObject.name + " <span class='accent'> x" + latestObject.amount + "</span>";
                  break;
              }
          }
        
            text += "</span>";
            // Update
            $('.latest-container').html(text);
            
        
            // Fade in
            $('.latest-container').fadeIn();
      
          latest_pos++;
          if (latest_pos == latest_keys.length) {
              latest_pos = 0;
          }
      });
  }, settings.stats.refresh_rate * 1000);
}

// On widget load, setup settings/state etc
window.addEventListener('onWidgetLoad', function(obj) {
    console.log('ON WIDGET LOAD')
    console.log(obj)
  // Variables
    let fieldData = obj.detail.fieldData;
    currency = obj.detail.currency.symbol;
    if (channelName == '') {
      channelName = obj.detail.channel.username;
  }
    
    // Update settings
    settings.stats.refresh_rate = fieldData.stats_refresh_rate;

    // Latest
    if (fieldData.latest_toggle_follower == "true") {
      state.latest.follower.empty = fieldData.latest_follower_empty;
        state.latest.follower.enabled = true;
        state.latest.follower.icon = fieldData.followers_icon;
        
        if (obj.detail.session.data["follower-latest"].name != "") {
          state.latest.follower.name = obj.detail.session.data["follower-latest"].name;
      }
  } else {
      delete state.latest.follower;
  }
    if (fieldData.latest_toggle_donation == "true") {
      state.latest.donation.empty = fieldData.latest_donation_empty;
        state.latest.donation.enabled = true;
        state.latest.donation.icon = fieldData.donation_icon;
    
        if (obj.detail.session.data["tip-session-top-donation"].name != "") {
          state.latest.donation.name = obj.detail.session.data["tip-session-top-donation"].name;
            state.latest.donation.amount = obj.detail.session.data["tip-session-top-donation"].amount;
      }
  } else {
      delete state.latest.donation;
  }
    if (fieldData.latest_toggle_cheer == "true") {
      state.latest.cheer.empty = fieldData.latest_cheer_empty;
        state.latest.cheer.enabled = true;
        state.latest.cheer.icon = fieldData.cheer_icon;
    
        if (obj.detail.session.data["cheer-session-top-donation"].name != "") {
          state.latest.cheer.name = obj.detail.session.data["cheer-session-top-donation"].name;
            state.latest.cheer.amount = obj.detail.session.data["cheer-session-top-donation"].amount;
      }
  } else {
      delete state.latest.cheer;
  }
    if (fieldData.latest_toggle_subscriber == "true") {
      state.latest.subscriber.empty = fieldData.latest_subscriber_empty;
        state.latest.subscriber.enabled = true;
        state.latest.subscriber.icon = fieldData.subs_icon;
    
        if (obj.detail.session.data["subscriber-latest"].name != "") {
          state.latest.subscriber.name = obj.detail.session.data["subscriber-latest"].name;
            state.latest.subscriber.amount = obj.detail.session.data["subscriber-latest"].amount;
      }
  } else {
      delete state.latest.subscriber;
  }
    // Start Everything!
    start();
});

// On session update
window.addEventListener('onSessionUpdate', function(obj) {
    console.log('ON SESSION UPDATE')
    console.log(obj)

  
    // Latest - Donation
    if (state.latest.donation) {
      state.latest.donation.name = obj.detail.session["tip-session-top-donation"].name;
        state.latest.donation.amount = obj.detail.session["tip-session-top-donation"].amount;
  }

    // Latest - Cheer
    if (state.latest.cheer) {
      state.latest.cheer.name = obj.detail.session["cheer-session-top-donation"].name;
        state.latest.cheer.amount = obj.detail.session["cheer-session-top-donation"].amount;
  }

    // Latest - Subscriber
    if (state.latest.subscriber) {
      state.latest.subscriber.name = obj.detail.session["subscriber-latest"].name;
        state.latest.subscriber.amount = obj.detail.session["subscriber-latest"].amount;
  }

    // Latest - Follower
    if (state.latest.follower) {
      state.latest.follower.name = obj.detail.session["follower-latest"].name;
  }
});