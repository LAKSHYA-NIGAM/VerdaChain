// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerdaChain {
    struct Verification {
        string  creditId;
        bytes32 resultHash;
        uint8   riskScore;
        string  status;
        address verifier;
        uint256 timestamp;
    }

    mapping(string => Verification[]) public verifications;
    Verification[] public allVerifications;

    event CreditVerified(
        string  indexed creditId,
        bytes32 resultHash,
        uint8   riskScore,
        string  status,
        address verifier,
        uint256 timestamp
    );

    function logVerification(
        string  memory _creditId,
        bytes32 _resultHash,
        uint8   _riskScore,
        string  memory _status
    ) public {
        Verification memory v = Verification({
            creditId:   _creditId,
            resultHash: _resultHash,
            riskScore:  _riskScore,
            status:     _status,
            verifier:   msg.sender,
            timestamp:  block.timestamp
        });
        verifications[_creditId].push(v);
        allVerifications.push(v);
        emit CreditVerified(_creditId, _resultHash, _riskScore, _status, msg.sender, block.timestamp);
    }

    function getVerifications(string memory _creditId) public view returns (Verification[] memory) {
        return verifications[_creditId];
    }

    function getTotalCount() public view returns (uint256) {
        return allVerifications.length;
    }
}
