-- Copied from https://discussions.apple.com/thread/8018663?sortBy=rank

use AppleScript version "2.8" -- Big Sur or later
use framework "Foundation"
use scripting additions

property ca : current application
property exportFormat : "txt"
property fmsg : "Choose or Create Export Folder"
property fdefault : (path to desktop) as alias
property export_folder : ""
property fileCnt : 0

on open dropped_items
	set export_folder to choose folder with prompt fmsg default location fdefault
	
	repeat with anItem in dropped_items
		tell application "Finder"
			set nameExt to name extension of anItem
			if nameExt is "pages" then
				my export_file(anItem)
			else if kind of anItem is "Folder" then
				set docList to (every file of entire contents of folder anItem whose name extension is "pages")
				repeat with afile in docList
					my export_file(afile as alias)
				end repeat
			end if
		end tell
	end repeat
	
	display dialog "Export Complete." & return & tab & "Files exported to " & ¬
		exportFormat & ": " & (fileCnt as text) buttons {"Done"} default button "Done"
end open

on export_file(theFile)
	try
		set basename to my new_extension(theFile, exportFormat, 1)
		set exportDocument to ((POSIX path of export_folder) & basename)
		
		tell application "Pages"
			set myDoc to open theFile
			with timeout of 1800 seconds
				export myDoc to (POSIX file exportDocument) as unformatted text
			end timeout
			set fileCnt to fileCnt + 1
			close myDoc saving no
		end tell
	on error errmsg number errnbr
		my error_handler("Export File", errnbr, errmsg)
	end try
end export_file

on new_extension(afile, ext, name_flag)
	set fullPath to ca's NSString's alloc()'s initWithString:(POSIX path of afile)
	set newfile to (fullPath's stringByDeletingPathExtension()'s stringByAppendingPathExtension:ext)
	if name_flag = 1 then return (newfile's lastPathComponent() as text)
	return newfile as text
end new_extension

on error_handler(handler_name, nbr, msg)
	display alert handler_name & ": " & "[ " & nbr & " ] " & msg as critical giving up after 10
end error_handler
