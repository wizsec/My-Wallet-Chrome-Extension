
$(document).ready(function(){

	$('#restore-wallet-continue').after(' <button class="btn btn-primary" id="login-with-skeletonkey">Login with SkeletonKey</button>');

	$('#login-with-skeletonkey').unbind().click(function() {
		SkeletonKey.getCredentials(function(result) {
			var credentials = result.value;

			SkeletonKey.listenForDisconnect(function() {
				MyStore.clear();
				MyWallet.logout();
			});

			$('#restore-guid').val(credentials.acct.walletGUID);
			$('#restore-password').val(credentials.acct.walletPassword);
			$('#restore-wallet-continue').click();
		});
	});

});
