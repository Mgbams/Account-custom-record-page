public without sharing class PaginationDemoController {
    
    @AuraEnabled(cacheable = true)
    public static List<Contact> getContacts(Integer pageSize, String lastRecordId) {
        String query = 'SELECT Id, FirstName, LastName, Phone, Email, Department FROM Contact ';
        if (String.isNotBlank(lastRecordId)) {
            query += 'WHERE Id > :lastRecordId';
        }
                         
        query += ' ORDER BY Id LIMIT :pageSize';
        return Database.query(query);
    }

    @AuraEnabled(cacheable = true)
    public static List<Opportunity> getOpportunities(Integer pageSize, String lastRecordId) {
        String query = 'SELECT Id, StageName, Amount, AccountId FROM Opportunity ';
        if (String.isNotBlank(lastRecordId)) {
            query += 'WHERE Id > :lastRecordId';
        }
                         
        query += ' ORDER BY Id LIMIT :pageSize';
        return Database.query(query);
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

    @AuraEnabled(cacheable = true)
    public static Integer getTotalContactsCount() {
        return [SELECT COUNT() FROM Contact];
    }

    @AuraEnabled(cacheable = true)
    public static Integer getTotalOpportunitiesCount() {
        return [SELECT COUNT() FROM Opportunity];
    }
       
}