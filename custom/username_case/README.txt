Description
-----------

This module allows you to make usernames for your users case sensitive. What
this means is you can have a user with the name 'admin' and 'AdMiN' and they
will be treated as seperate users as far as drupal is concerned.

Stock behaviour for Drupal 7 on MySQL is for names to be case insensitive. This
can make it easier for attackers to guess usernames

Features
--------

* Integrates with MySQL at the moment, and alters the 'name' column in the
  {users} table to be of type 'varbinary(60)'
* Provides a checkbox on the 'admin/config/people/accounts' page where you can
  switch the case-sensivity on and off

Important points to note with a case-sensitive collation
--------------------------------------------------------

* You will need to tell your users that they must login with their exact
  username
* If you create two users 'Admin' and 'admin' for example, you will not be able
  to switch back to case in-sensitive usernames without first deleting one of
  the users
* Any view or admin page that sorts by username will sort differently, with a
  case sensitive collation, sorting is from A -> Z, a -> z. So some pages may
  not be what the user expects. Please refer to
  http://stackoverflow.com/questions/5526334/what-effects-does-using-a-binary-collation-have
  for more information
* Any view or admin page that filters by username will filter differently with a
  case sensitive collation. 'A' is not the same as 'a'

TODO
----

* Look at what Drupal 8 is doing - this issue is relevant
  http://drupal.org/node/1237252
* Work out if this module impacts any other core or contrib modules in a way
  that will potentially break them

Requirements
------------

* Nothing special, core user module really ;)

Installation
------------

Copy the 'username_case' module directory in to your Drupal sites/all/modules
directory as usual.
