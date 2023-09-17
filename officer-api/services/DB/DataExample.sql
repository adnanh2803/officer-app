SELECT * FROM vw_UserAgreementFull

SELECT * FROM vw_UserRole

SELECT * FROM User

SELECT * FROM Role

INSERT INTO Role(RoleName,Privileges) VALUES('Software Engineer', 1111);

INSERT INTO User(FullName,UserName, Password, Email, RoleId) VALUES('Adnan Hodzic', 'adhodzic', 'secret', 'adnan.hodzic@unipu.hr', 1);

INSERT INTO Asset(Name, Label) VALUES('Dell Vostro 5490', 'FIPU-001');
INSERT INTO Asset(Name, Label) VALUES('Logitech Baracuda X', 'FIPU-002');
INSERT INTO Asset(Name, Label) VALUES('Logitech MX Mechanical', 'FIPU-003');
INSERT INTO Asset(Name, Label) VALUES('Logitech G608', 'FIPU-004');

INSERT INTO UserAgreement(UserId, Status) VALUES(1, 'DRAFT');

INSERT INTO UserAgreementAsset(UserAgreementId, AssetId) VALUES(1, 1);
INSERT INTO UserAgreementAsset(UserAgreementId, AssetId) VALUES(1, 2);
INSERT INTO UserAgreementAsset(UserAgreementId, AssetId) VALUES(1, 3);
INSERT INTO UserAgreementAsset(UserAgreementId, AssetId) VALUES(1, 4);

