public with sharing class PaginationDemoController {
    
    @AuraEnabled(cacheable = true)
    public static List<Contact> getContacts(Integer pageSize, Integer offset) {
        List<Contact> conList = [SELECT Id, Name, Phone, Email, Department 
                                 FROM Contact
                                 ORDER BY Id 
                                 LIMIT :pageSize OFFSET : offset];
        return conList;
    }

    @AuraEnabled(cacheable = true)
    public static List<Opportunity> getOpportunities(Integer pageSize, Integer offset) {
       List<Opportunity> oppList = [SELECT Id, Name, StageName, Amount, AccountId 
                                    FROM Opportunity 
                                    ORDER BY Id 
                                    LIMIT :pageSize OFFSET : offset];
        return oppList;
    }

    /*@AuraEnabled(cacheable = true)
    public static List<Contact_GL__c> getContactsGL(Integer pageSize, Integer offset) {
        List<Contact_GL__c> conGlList = [SELECT Id, Name, Nom__c, Prenom__c, Poste__c, OwnerId, Owner.Name 
                                 FROM Contact_GL__c
                                 ORDER BY Id 
                                 LIMIT :pageSize OFFSET : offset];
        return conGlList;
    }*/
    @AuraEnabled(cacheable = true)
    public static List<Contact_GL__c> getContactsGL(Integer pageSize, String lastRecordId) {
        String query = 'SELECT Id, Name, Nom__c, Prenom__c, Poste__c, OwnerId, Owner.Name FROM Contact_GL__c ';
        if (String.isNotBlank(lastRecordId)) {
            query += 'WHERE Id > :lastRecordId';
        }

        query += ' ORDER BY Id LIMIT :pageSize';
        return Database.query(query);
    }

    @AuraEnabled(cacheable = true)
    public static Integer getTotalContactsGlCount() {
        return [SELECT COUNT() FROM Contact_GL__c];
    }
       
}