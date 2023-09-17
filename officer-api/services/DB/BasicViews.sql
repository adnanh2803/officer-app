CREATE VIEW vw_UserRole as
SELECT
	u.FullName,
	u.UserName,
	u.Email,
	u.OIB,
	r.RoleName,
	r.Privileges
FROM User u
LEFT JOIN Role r ON r._id = u._id

CREATE VIEW vw_UserAgreementFull as
SELECT
	ua.Status,
	ua.DocumentURL,
	u.FullName,
	r.RoleName,
	(
		SELECT group_concat(a.Name) 
		FROM UserAgreementAsset uaa
		LEFT JOIN Asset a ON a._id = uaa.AssetId
		WHERE uaa.UserAgreementId = ua._id
	) as Assets
FROM UserAgreement ua
LEFT JOIN User u ON u._id = ua.UserId
LEFT JOIN Role r ON r._id = u.RoleId
